import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export const saveOrder = async (orderData: any) => {
    const user = auth.currentUser;
    if (!user) {
        alert("Please login first");
        return;
    }

    try {
        await addDoc(collection(db, "orders"), {
            userId: user.uid,
            items: orderData.items,
            totalPrice: orderData.totalPrice,
            customer: orderData.customer, // name, address, phone, email
            date: serverTimestamp(), // ✅ Firestore timestamp
        });

        console.log("✅ Order saved to Firebase");
    } catch (err) {
        console.error("❌ Failed to save order:", err);
    }
};
