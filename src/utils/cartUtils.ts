import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import {
    clearCartFromStorage,
    loadCartFromStorage,
    saveCartToStorage,
} from "./cartStorage";

const normalizeProduct = (product: any) => {
    const normalized: any = {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
    };

    if (product.brand) normalized.brand = product.brand;
    if (product.category) normalized.category = product.category;

    return normalized;
};

export const addToCart = async (product: any, quantity = 1) => {
    try {
        console.log("🛒 addToCart called with:", product, "qty:", quantity);

        const user = auth.currentUser;
        const normalizedProduct = normalizeProduct(product);

        if (!user) {
            const cart = loadCartFromStorage(null);
            const existingItem = cart.find((item: any) => item.id === normalizedProduct.id);

            if (existingItem) {
                existingItem.quantity += quantity;
                console.log(`🔁 Increased quantity for: ${normalizedProduct.title}`);
            } else {
                cart.push({ ...normalizedProduct, quantity });
                console.log(`✨ Added new item: ${normalizedProduct.title}`);
            }

            saveCartToStorage(cart, null);
            console.log("✅ Guest cart saved:", cart);
            return;
        }

        const cartRef = doc(db, "carts", user.uid);
        const snapshot = await getDoc(cartRef);

        let items: any[] = [];
        let customerData: any = {
            name: user.displayName || "",
            email: user.email || "",
            phone: "",
            address: "",
        };

        if (snapshot.exists()) {
            const data = snapshot.data();
            items = data.customer?.items || [];
            customerData = {
                ...customerData,
                ...data.customer,
            };
        }

        const existingIndex = items.findIndex((item: any) => item.id === normalizedProduct.id);

        if (existingIndex >= 0) {
            items[existingIndex].quantity += quantity;
            console.log(`🔁 Increased quantity for: ${normalizedProduct.title}`);
        } else {
            items.push({ ...normalizedProduct, quantity });
            console.log(`✨ Added new item: ${normalizedProduct.title}`);
        }

        await setDoc(
            cartRef,
            {
                customer: {
                    ...customerData,
                    items,
                },
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        );

        // Ensure any stale local storage for this user is cleared
        clearCartFromStorage(user.uid);

        console.log("✅ Cart saved to Firestore:", items);
    } catch (error) {
        console.error("❌ Error adding to cart:", error);
        throw error;
    }
};
