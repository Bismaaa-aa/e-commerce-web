import { useNavigate } from "react-router-dom";

export default function PaymentFailed() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100 px-4 text-center">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Payment Failed</h1>
            <p className="text-gray-600 mb-4">Your payment was not completed. Please try again.</p>
            <button onClick={() => navigate("/cart")} className="px-6 py-3 rounded-full font-semibold shadow" style={{ background: "#e63946", color: "white" }}>Back to Cart</button>
        </div>
    );
}
