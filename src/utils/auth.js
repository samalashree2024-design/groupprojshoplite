const USERS_STORAGE_KEY = 'shoplite_users';

export function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

export function isValidEmail(email) {
    const normalized = normalizeEmail(email);
    if (!normalized) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

export function buildCustomerIdFromEmail(email) {
    const normalized = normalizeEmail(email);
    return `CUS-${normalized.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10).toUpperCase()}`;
}

export function readUsers() {
    try {
        const raw = localStorage.getItem(USERS_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function writeUsers(users) {
    try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        return true;
    } catch {
        return false;
    }
}

function randomSaltHex(bytesCount = 16) {
    const bytes = new Uint8Array(bytesCount);
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
        crypto.getRandomValues(bytes);
    } else {
        for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

function toHex(arrayBuffer) {
    return Array.from(new Uint8Array(arrayBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

async function sha256Hex(text) {
    if (
        typeof crypto === 'undefined' ||
        !crypto?.subtle?.digest ||
        typeof TextEncoder === 'undefined'
    ) {
        // Fallback (non-cryptographic) hash for environments without WebCrypto.
        let hash = 0;
        for (let i = 0; i < text.length; i += 1) {
            hash = (hash << 5) - hash + text.charCodeAt(i);
            hash |= 0;
        }
        return String(hash);
    }

    const bytes = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return toHex(digest);
}

async function hashPasswordWithSalt(saltHex, password) {
    const pwd = String(password || '');
    const salt = String(saltHex || '');
    return sha256Hex(`${salt}:${pwd}`);
}

export async function registerUser({ name, email, password }) {
    const normalizedEmail = normalizeEmail(email);
    const trimmedName = String(name || '').trim();
    const trimmedPassword = String(password || '').trim();

    const existing = readUsers();
    const already = existing.find((u) => normalizeEmail(u?.email) === normalizedEmail);
    if (already) return { ok: false, error: 'EMAIL_EXISTS' };

    const salt = randomSaltHex(16);
    const passwordHash = await hashPasswordWithSalt(salt, trimmedPassword);
    const user = {
        email: normalizedEmail,
        name: trimmedName,
        id: buildCustomerIdFromEmail(normalizedEmail),
        salt,
        passwordHash,
        createdAt: new Date().toISOString(),
    };

    const saved = writeUsers([user, ...existing]);
    if (!saved) return { ok: false, error: 'STORAGE_FAILED' };

    return { ok: true, user };
}

export async function authenticateUser({ email, password }) {
    const normalizedEmail = normalizeEmail(email);
    const trimmedPassword = String(password || '').trim();

    const existing = readUsers();
    const user = existing.find((u) => normalizeEmail(u?.email) === normalizedEmail);
    if (!user) return { ok: false, error: 'NOT_FOUND' };

    const attempted = await hashPasswordWithSalt(user.salt, trimmedPassword);
    if (attempted !== user.passwordHash) return { ok: false, error: 'INVALID_PASSWORD' };

    return { ok: true, user };
}

