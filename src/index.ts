import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

// Example function to update stock
export const updateStockAfterPayment = functions.https.onCall(async (data, context) => {
    // You can access Firestore via admin
    const { items } = data; // array of { id, quantity }
    const db = admin.firestore();

    try {
        for (const item of items) {
            const productRef = db.collection("products").doc(item.id);
            const snap = await productRef.get();
            if (snap.exists) {
                const newQty = snap.data()?.quantity - item.quantity;
                await productRef.update({ quantity: newQty >= 0 ? newQty : 0 });
            }
        }
        return { success: true };
    } catch (err) {
        console.error(err);
        throw new functions.https.HttpsError("internal", "Failed to update stock");
    }
});
