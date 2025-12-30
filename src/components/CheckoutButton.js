import React, { useState } from "react";
import { useCart } from "../context/CartContext";

export default function CheckoutButton() {
    const { cartItems } = useCart();
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty");
            return;
        }

        setLoading(true);

        try {
            // 1️⃣ Call backend to create a checkout session
            const res = await fetch("http://localhost:5000/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cartItems }),
            });

            const data = await res.json();

            if (data.error) {
                alert(data.error);
                setLoading(false);
                return;
            }

            // 2️⃣ Redirect to Stripe Checkout
            window.location.href = data.url;
        } catch (err) {
            console.error(err);
            alert("Failed to start checkout. Please try again.");
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={loading || cartItems.length === 0}
            className={`px-6 py-3 rounded-full font-semibold shadow text-white transition ${loading || cartItems.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#056EA5] hover:bg-[#034F7B]"
                }`}
        >
            {loading ? "Redirecting..." : "Checkout"}
        </button>
    );
}
