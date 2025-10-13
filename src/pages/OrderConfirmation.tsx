import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderConfirmation() {
    const customer = JSON.parse(localStorage.getItem("customer") || "{}");

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100 text-center px-4">
            <CheckCircle size={80} className="text-green-500 mb-4 animate-bounce" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#056EA5] via-[#034F7B] to-[#023859] drop-shadow mb-2">
                🎉 Order Confirmed!
            </h1>
            <p className="text-gray-700 mb-6">
                Thank you {customer.name || ""} for shopping with us! 💕 <br />
                Your order is being prepared and will be delivered soon.
            </p>
            <Link
                to="/shop"
                className="bg-gradient-to-r from-[#056EA5] to-[#034F7B] text-white px-6 py-2 rounded-full font-semibold shadow hover:scale-105 transition"
            >
                Continue Shopping 🛍️
            </Link>
        </div>
    );
}
