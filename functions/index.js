const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");

admin.initializeApp();
const firestore = admin.firestore();

// Initialize Stripe with your secret key
const stripe = new Stripe(functions.config().stripe.secret); // use Firebase functions config for security

exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, functions.config().stripe.webhook_secret);
    } catch (err) {
        console.error("Webhook signature failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        let items = [];

        try {
            items = JSON.parse(session.metadata.items);
        } catch (err) {
            console.error("Failed to parse session metadata:", err);
            return res.status(400).send("Invalid metadata items");
        }

        for (const item of items) {
            const productRef = firestore.collection("products").doc(item.id);

            await firestore.runTransaction(async (t) => {
                const productDoc = await t.get(productRef);
                if (!productDoc.exists) return;

                const currentStock = Number(productDoc.data().stock) || 0;
                const newStock = currentStock - Number(item.quantity);

                t.update(productRef, {
                    stock: newStock >= 0 ? newStock : 0,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
            });
        }

        console.log("✅ Stock updated for session:", session.id);
    }

    res.json({ received: true });
});
