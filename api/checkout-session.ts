import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
}

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2023-10-16",
});

export default async function handler(req: any, res: any) {
    if (req.method !== "GET") {
        res.status(405).json({ message: "Method not allowed" });
        return;
    }

    const sessionId =
        req.query?.session_id ||
        req.query?.sessionId ||
        (req.body?.session_id ?? req.body?.sessionId);

    if (!sessionId || typeof sessionId !== "string") {
        res.status(400).json({ message: "Missing session_id parameter." });
        return;
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["line_items", "payment_intent", "payment_intent.charges"],
        });
        res.status(200).json(session);
    } catch (error) {
        console.error("[Stripe] fetch checkout session failed:", error);
        res.status(500).json({
            message: "Unable to fetch checkout session.",
            error: error instanceof Error ? error.message : error,
        });
    }
}

