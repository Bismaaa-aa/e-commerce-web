import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, runTransaction } from "firebase/firestore";

// ----- Types -----
interface CartItem {
    id: string;
    title: string;
    price: number;
    thumbnail: string;
    quantity: number;
    stock: number;
}

interface CartContextType {
    cart: CartItem[];
    loading: boolean;
    error: string | null;
    userEmail: string | null;
    addItem: (item: CartItem) => void;
    decreaseItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    requireLogin: () => Promise<void>;
    persistCart: (cart: CartItem[]) => Promise<void>;
    refreshStockFlag: boolean;
    triggerRefreshStock: () => void;
    updateProductStock: (items: CartItem[]) => Promise<void>;
}

// ----- LocalStorage Helpers -----
const getLocalCart = (): CartItem[] => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
};
const saveLocalCart = (cart: CartItem[]) => localStorage.setItem("cart", JSON.stringify(cart));
const clearLocalCart = () => localStorage.removeItem("cart");

// ----- Cart Context -----
const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);

    // ----- Refresh stock flag -----
    const [refreshStockFlag, setRefreshStockFlag] = useState(false);
    const triggerRefreshStock = () => setRefreshStockFlag(prev => !prev);

    // ----- Initialize Cart -----
    const initializeCart = useCallback(async () => {
        setLoading(true);
        try {
            const user = auth.currentUser;
            if (user) {
                setUserEmail(user.email);
                const userRef = doc(db, "users", user.email);
                const snap = await getDoc(userRef);
                const remoteCart: CartItem[] = snap.exists() ? snap.data().cart || [] : [];

                if (!initialized) {
                    const localCart = getLocalCart();
                    const mergedCart: CartItem[] = [...remoteCart];

                    localCart.forEach(localItem => {
                        const exist = mergedCart.find(i => i.id === localItem.id);
                        if (exist) exist.quantity += localItem.quantity;
                        else mergedCart.push(localItem);
                    });

                    setCart(mergedCart);
                    await setDoc(
                        userRef,
                        { cart: mergedCart, email: user.email, updatedAt: new Date() },
                        { merge: true }
                    );
                    clearLocalCart();
                    setInitialized(true);
                } else {
                    setCart(remoteCart);
                }
            } else {
                setUserEmail(null);
                setCart(getLocalCart());
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load cart");
        } finally {
            setLoading(false);
        }
    }, [initialized]);

    useEffect(() => {
        initializeCart();
        const unsubscribe = auth.onAuthStateChanged(() => initializeCart());
        return () => unsubscribe();
    }, [initializeCart]);

    // ----- Persist Cart -----
    const persistCart = async (newCart: CartItem[]) => {
        setCart(newCart);
        if (userEmail) {
            const userRef = doc(db, "users", userEmail);
            await setDoc(
                userRef,
                { cart: newCart, email: userEmail, updatedAt: new Date() },
                { merge: true }
            );
        } else {
            saveLocalCart(newCart);
        }
    };

    // ----- Add, Decrease, Remove -----
    const addItem = async (item: CartItem) => {
        try {
            const productSnap = await getDoc(doc(db, "products", item.id));
            const productStock = productSnap.exists() ? productSnap.data().quantity : 0;

            setCart(prev => {
                const existing = prev.find(i => i.id === item.id);
                const currentQty = existing ? existing.quantity : 0;

                if (currentQty + 1 > productStock) {
                    alert("No more quantity available for this product!");
                    return prev;
                }

                const next = existing
                    ? prev.map(i => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
                    : [...prev, { ...item, quantity: 1 }];

                persistCart(next);
                return next;
            });
        } catch (err) {
            console.error(err);
            alert("Failed to add product to cart. Please try again.");
        }
    };

    const decreaseItem = async (item: CartItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (!existing) return prev;

            const nextQty = existing.quantity - 1;
            const next = nextQty <= 0
                ? prev.filter(i => i.id !== item.id)
                : prev.map(i => (i.id === item.id ? { ...i, quantity: nextQty } : i));

            persistCart(next);
            return next;
        });
    };

    const removeItem = async (id: string) => {
        setCart(prev => {
            const next = prev.filter(i => i.id !== id);
            persistCart(next);
            return next;
        });
    };

    const requireLogin = async () => {
        alert("Please login to add items to your cart");
    };

    // ----- Update product stock in Firestore -----
    const updateProductStock = async (items: CartItem[]) => {
        try {
            for (const item of items) {
                const productRef = doc(db, "products", item.id);
                await runTransaction(db, async (transaction) => {
                    const productDoc = await transaction.get(productRef);
                    if (!productDoc.exists()) return;

                    const currentQty = productDoc.data().quantity || 0;
                    const newQty = currentQty - item.quantity;
                    transaction.update(productRef, { quantity: newQty < 0 ? 0 : newQty });
                });
            }
            triggerRefreshStock(); // refresh ProductList
            alert("Stock updated successfully!");
        } catch (err: any) {
            console.error("Failed to update stock:", err.message || err);
            alert(`Failed to update stock: ${err.message || err}`);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                error,
                userEmail,
                addItem,
                decreaseItem,
                removeItem,
                requireLogin,
                persistCart,
                refreshStockFlag,
                triggerRefreshStock,
                updateProductStock
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// ----- Hook -----
export const useCart = () => useContext(CartContext) as CartContextType;
