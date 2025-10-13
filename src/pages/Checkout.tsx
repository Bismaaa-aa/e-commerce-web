import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Save customer details to localStorage (optional)
        localStorage.setItem("customer", JSON.stringify(customer));
        // Redirect to final order confirmation
        navigate("/order-confirmation");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100 px-4">
            <h1 className="text-3xl font-bold mb-6" style={{ color: "#056EA5" }}>
                📝 Enter Your Details
            </h1>
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md flex flex-col gap-4"
            >
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={customer.name}
                    onChange={handleChange}
                    required
                    className="p-3 border rounded-lg"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={customer.email}
                    onChange={handleChange}
                    required
                    className="p-3 border rounded-lg"
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={customer.phone}
                    onChange={handleChange}
                    required
                    className="p-3 border rounded-lg"
                />
                <textarea
                    name="address"
                    placeholder="Shipping Address"
                    value={customer.address}
                    onChange={handleChange}
                    required
                    className="p-3 border rounded-lg resize-none"
                />
                <button
                    type="submit"
                    className="bg-gradient-to-r from-[#056EA5] to-[#034F7B] text-white px-6 py-3 rounded-full font-semibold shadow hover:scale-105 transition mt-2"
                >
                    Place Order 💖
                </button>
            </form>
        </div>
    );
}
