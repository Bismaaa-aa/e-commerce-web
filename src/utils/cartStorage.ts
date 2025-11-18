const LEGACY_GUEST_KEY = "cart";

export const getCartStorageKey = (uid?: string | null) =>
    uid ? `cart_${uid}` : "cart_guest";

export const loadCartFromStorage = <T = any>(uid?: string | null): T[] => {
    try {
        const key = getCartStorageKey(uid);
        const raw = localStorage.getItem(key);

        if (raw) {
            return JSON.parse(raw) as T[];
        }

        if (!uid) {
            const legacyRaw = localStorage.getItem(LEGACY_GUEST_KEY);
            if (legacyRaw) {
                return JSON.parse(legacyRaw) as T[];
            }
        }
    } catch (error) {
        console.error("Failed to load cart from storage", error);
    }

    return [];
};

export const saveCartToStorage = (items: any[], uid?: string | null) => {
    try {
        const key = getCartStorageKey(uid);
        localStorage.setItem(key, JSON.stringify(items));

        if (!uid) {
            localStorage.removeItem(LEGACY_GUEST_KEY);
        }
    } catch (error) {
        console.error("Failed to save cart to storage", error);
    }
};

export const clearCartFromStorage = (uid?: string | null) => {
    try {
        localStorage.removeItem(getCartStorageKey(uid));

        if (!uid) {
            localStorage.removeItem(LEGACY_GUEST_KEY);
        }
    } catch (error) {
        console.error("Failed to clear cart from storage", error);
    }
};

