import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface CartItem {
    id: number;
    title: string;
    thumbnail: string;
    price: number;
    quantity: number;
}

export default function Cart() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showCheckout, setShowCheckout] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [customer, setCustomer] = useState({ name: "", email: "", phone: "", address: "" });
    const isInitialMount = useRef(true);
    const navigate = useNavigate();

    const accentColor = "#056EA5"; // Accent color

    // Load cart from localStorage
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) setCart(JSON.parse(storedCart));
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const increaseQuantity = (id: number) =>
        setCart((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
        );

    const decreaseQuantity = (id: number) =>
        setCart((prev) =>
            prev
                .map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 } : item
                )
                .filter((item) => item.quantity > 0)
        );

    const removeFromCart = (id: number) => setCart((prev) => prev.filter((item) => item.id !== id));

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // Open checkout modal
    const handleProceedToCheckout = () => setShowCheckout(true);

    // Handle customer input change
    const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    // Submit checkout
    const handleCheckoutSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem("customer", JSON.stringify(customer));
        setOrderConfirmed(true);
        localStorage.removeItem("cart");
        setCart([]);
        setShowCheckout(false);
        setTimeout(() => navigate("/"), 2000);
    };

    if (orderConfirmed) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-white to-gray-100 text-center p-6 animate-fadeIn">
                <h1 className="text-5xl font-bold mb-4 animate-bounce" style={{ color: accentColor }}>
                    🎉 Order Confirmed!
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                    Thank you {customer.name || ""} for shopping with us 💖<br />
                    Your order is on its way!
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition"
                    style={{ background: `linear-gradient(to right, ${accentColor}, #034F7B)`, color: "white" }}
                >
                    Back to Home 🏠
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-white to-gray-100">
            <h1 className="text-4xl font-bold mb-6 text-center" style={{ color: accentColor }}>
                🛒 Your Cart
            </h1>

            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20 text-center space-y-6">
                    <div className="text-6xl animate-bounce" style={{ color: accentColor }}>
                        🛍️✨
                    </div>
                    <h2 className="text-3xl font-bold" style={{ color: accentColor }}>
                        Your cart is empty!
                    </h2>
                    <p className="text-gray-700 max-w-xs">
                        Oops! You haven’t added anything yet. Explore our products and fill your cart with joy! 💖
                    </p>
                    <button
                        onClick={() => navigate("/shop")}
                        className="px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition"
                        style={{ background: `linear-gradient(to right, ${accentColor}, #034F7B)`, color: "white" }}
                    >
                        Start Shopping 🛒
                    </button>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center border-b py-4 bg-white rounded-2xl shadow-sm px-4"
                                style={{ borderColor: accentColor }}
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="w-16 h-16 object-cover rounded-xl"
                                    />
                                    <div>
                                        <h2 className="font-semibold text-gray-800">{item.title}</h2>
                                        <p className="text-sm text-gray-500">
                                            ${item.price} × {item.quantity} ={" "}
                                            <span className="font-bold" style={{ color: accentColor }}>
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => decreaseQuantity(item.id)}
                                        className="px-3 py-1 rounded-lg text-lg"
                                        style={{ backgroundColor: `${accentColor}22` }}
                                    >
                                        −
                                    </button>
                                    <span className="font-semibold text-gray-800">{item.quantity}</span>
                                    <button
                                        onClick={() => increaseQuantity(item.id)}
                                        className="px-3 py-1 rounded-lg text-lg"
                                        style={{ backgroundColor: `${accentColor}22` }}
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500 ml-3 text-xl hover:scale-110 transition-transform"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between mt-8 text-2xl font-bold bg-white p-4 rounded-2xl shadow-md">
                        <span>Total:</span>
                        <span style={{ color: accentColor }}>${totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="text-center mt-6">
                        <button
                            onClick={handleProceedToCheckout}
                            className="px-8 py-2 rounded-full font-semibold shadow-lg hover:scale-105 transition"
                            style={{ background: `linear-gradient(to right, ${accentColor}, #034F7B)`, color: "white" }}
                        >
                            Proceed to Checkout 💖
                        </button>
                    </div>
                </>
            )}

            {/* Checkout Form Modal */}
            {showCheckout && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
                    <form
                        onSubmit={handleCheckoutSubmit}
                        className="bg-white rounded-2xl p-6 w-full max-w-md flex flex-col gap-4 shadow-lg"
                    >
                        <h2 className="text-2xl font-bold text-center" style={{ color: accentColor }}>
                            📝 Your Details
                        </h2>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={customer.name}
                            onChange={handleCustomerChange}
                            required
                            className="p-3 border rounded-lg"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={customer.email}
                            onChange={handleCustomerChange}
                            required
                            className="p-3 border rounded-lg"
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={customer.phone}
                            onChange={handleCustomerChange}
                            required
                            className="p-3 border rounded-lg"
                        />
                        <textarea
                            name="address"
                            placeholder="Shipping Address"
                            value={customer.address}
                            onChange={handleCustomerChange}
                            required
                            className="p-3 border rounded-lg resize-none"
                        />
                        <div className="flex justify-between mt-2">
                            <button
                                type="button"
                                onClick={() => setShowCheckout(false)}
                                className="px-4 py-2 rounded-full font-semibold shadow hover:scale-105 transition"
                                style={{ background: `#ccc`, color: "#333" }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 rounded-full font-semibold shadow hover:scale-105 transition"
                                style={{ background: `linear-gradient(to right, ${accentColor}, #034F7B)`, color: "white" }}
                            >
                                Place Order 💖
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
