import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  collection,
  query,
  where,
  getDocs,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase";

export default function PaymentSuccess() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cart, persistCart } = useCart();
  const sessionId = searchParams.get("session_id");

  // Fetch Stripe session
  useEffect(() => {
    if (!sessionId) {
      setError("Missing session ID");
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/checkout-session/${sessionId}`
        );
        const data = await res.json();
        setSession(data);
      } catch {
        setError("Failed to load session");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  // Clear cart after successful payment (Stock is updated via Webhook)
  useEffect(() => {
    if (session && cart.length > 0) {
      persistCart([]);
    }
  }, [session, cart, persistCart]);

  if (loading) return <p className="text-center mt-6">Verifying payment...</p>;
  if (error || !session)
    return (
      <p className="text-center mt-6 text-red-500">
        {error || "Session not found"}
      </p>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100 px-4 text-center">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-lg w-full space-y-4">
        <div className="text-5xl">🎉</div>

        <h1 className="text-3xl font-bold text-[#056EA5]">
          Payment Successful!
        </h1>

        <p className="text-lg">
          Amount:{" "}
          <span className="font-bold">
            ${(session.amount_total / 100).toFixed(2)}
          </span>
        </p>

        <p className="text-md text-gray-700">
          Email: {session.customer_details?.email || "—"}
        </p>

        <button
          onClick={() => navigate("/shop")}
          className="px-6 py-3 rounded-full font-semibold shadow mt-4 bg-[#056EA5] text-white hover:bg-[#034F7B] transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
