const ORDERS_STORAGE_KEY = 'orders';

export function readOrders() {
    try {
        const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function writeOrders(orders) {
    try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
        // ignore storage errors (private mode/quota/etc.)
    }
}

export function addOrder(order) {
    const existing = readOrders();
    writeOrders([order, ...existing]);
}

export function getOrdersForUser(allOrders, user) {
    if (!user?.email) return [];
    return allOrders.filter((o) => o?.userEmail === user.email);
}

