const RETURNS_STORAGE_KEY = 'returns';

export function readReturns() {
    try {
        const raw = localStorage.getItem(RETURNS_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function writeReturns(returns) {
    try {
        localStorage.setItem(RETURNS_STORAGE_KEY, JSON.stringify(returns));
    } catch {
        // ignore storage errors (private mode/quota/etc.)
    }
}

export function addReturnRequest(returnRequest) {
    const existing = readReturns();
    writeReturns([returnRequest, ...existing]);
}

export function setReturnStatus(returnId, status) {
    const existing = readReturns();
    const next = existing.map((r) => (r?.id === returnId ? { ...r, status } : r));
    writeReturns(next);
}

export function getReturnsForUser(allReturns, user) {
    if (!user?.email) return [];
    return allReturns.filter((r) => r?.userEmail === user.email);
}

export function buildOrderItemKey(orderId, itemId) {
    return `${String(orderId)}::${String(itemId)}`;
}

