import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase"; // adjust import path
import { onAuthStateChanged } from "firebase/auth";
import { clearCartFromStorage, loadCartFromStorage } from "../utils/cartStorage";

export default function Checkout() {
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            // Pre-fill email if user is logged in
            if (currentUser) {
                setCustomer((prev) => ({
                    ...prev,
                    email: currentUser.email || "",
                }));
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [auth]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Retrieve cart from localStorage (assuming you saved it earlier)
            const uid = user?.uid || null;
            const cartItems = loadCartFromStorage(uid);
            const totalPrice = cartItems.reduce(
                (sum: number, item: any) => sum + item.price * item.quantity,
                0
            );

            // Save order to Firestore
            await addDoc(collection(db, "orders"), {
                userId: user?.uid || null,
                customer,
                items: cartItems,
                totalPrice,
                date: serverTimestamp(),
            });

            // Optionally clear cart
            clearCartFromStorage(uid);

            // Save customer locally if needed
            localStorage.setItem("customer", JSON.stringify(customer));

            // Redirect to order confirmation page
            navigate("/order-confirmation");
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

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

                {/* Only show email field if user is NOT logged in */}
                {!user && (
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={customer.email}
                        onChange={handleChange}
                        required
                        className="p-3 border rounded-lg"
                    />
                )}

                {user && (
                    <input
                        type="email"
                        name="email"
                        value={customer.email}
                        disabled
                        className="p-3 border rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                    />
                )}

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
