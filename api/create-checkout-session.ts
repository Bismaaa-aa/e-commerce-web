import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
}

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2023-10-16",
});

const fallbackClientUrl = process.env.CLIENT_URL || "http://localhost:5173";

interface CartItemPayload {
    id: number;
    title: string;
    price: number;
    quantity: number;
}

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") {
        res.status(405).json({ message: "Method not allowed" });
        return;
    }

    try {
        const body =
            typeof req.body === "string" && req.body.length
                ? JSON.parse(req.body)
                : req.body || {};
        const { items = [], customer = {} } = body as {
            items: CartItemPayload[];
            customer: Record<string, string>;
        };

        if (!Array.isArray(items) || items.length === 0) {
            res.status(400).json({ message: "Cart is empty." });
            return;
        }

        const origin = req.headers.origin || fallbackClientUrl;

        const sanitizedItems = items.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
        }));

        const metadataCart = JSON.stringify(sanitizedItems.slice(0, 10));

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            customer_email: customer.email || undefined,
            metadata: {
                userId: customer.userId || "guest",
                customerName: customer.name || "",
                customerEmail: customer.email || "",
                phone: customer.phone || "",
                cart: metadataCart,
            },
            line_items: sanitizedItems.map((item) => ({
                quantity: item.quantity,
                price_data: {
                    currency: "usd",
                    unit_amount: Math.round(item.price * 100),
                    product_data: {
                        name: item.title,
                    },
                },
            })),
            success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cart`,
            shipping_address_collection: { allowed_countries: ["US", "CA", "IN"] },
            automatic_tax: { enabled: false },
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error("[Stripe] create checkout session failed:", error);
        res.status(500).json({
            message: "Failed to initiate checkout.",
            error: error instanceof Error ? error.message : error,
        });
    }
}

