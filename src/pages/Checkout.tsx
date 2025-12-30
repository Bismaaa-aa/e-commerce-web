import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

interface CheckoutForm {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export default function Checkout() {
    const { cart, userEmail, clearCart } = useCart();
    const navigate = useNavigate();

    const [form, setForm] = useState<CheckoutForm>({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [stockMap, setStockMap] = useState<{ [key: string]: number }>({});

    // ✅ Load user data + stock data
    useEffect(() => {
        const loadData = async () => {
            if (userEmail) {
                try {
                    const userRef = doc(db, "users", userEmail);
                    const snap = await getDoc(userRef);
                    if (snap.exists()) {
                        const data = snap.data();
                        setForm({
                            name: data.name || "",
                            email: userEmail,
                            phone: data.phone || "",
                            address: data.address || "",
                            city: data.city || "",
                            postalCode: data.postalCode || "",
                            country: data.country || "",
                        });
                    } else {
                        setForm((prev) => ({ ...prev, email: userEmail }));
                    }
                } catch (err) {
                    console.error(err);
                }
            }

            // ✅ Get stock for all cart products
            const map: { [key: string]: number } = {};
            for (const item of cart) {
                const snap = await getDoc(doc(db, "products", item.id));
                if (snap.exists()) {
                    map[item.id] = snap.data().quantity;
                }
            }
            setStockMap(map);
            setLoading(false);
        };

        loadData();
    }, [userEmail]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ✅ 1. Check if cart is empty
        if (!cart || cart.length === 0) {
            setError("Your cart is empty");
            return;
        }

        try {
            // ✅ 2. Stock Validation
            for (const item of cart) {
                const maxStock = stockMap[item.id] ?? 0;
                if (item.quantity > maxStock) {
                    setError(`Not enough stock for ${item.title}. Available: ${maxStock}`);
                    return;
                }
            }

            // ✅ 3. Create order document
            const orderRef = doc(db, "orders", `${Date.now()}_${form.email}`);
            await setDoc(orderRef, {
                items: cart,
                user: form,
                createdAt: serverTimestamp(),
                status: "pending",
            });

            // ✅ 4. Reduce stock in Firestore for each purchased product
            for (const item of cart) {
                const productRef = doc(db, "products", item.id);
                const snap = await getDoc(productRef);
                if (snap.exists()) {
                    const currentQty = snap.data().quantity;
                    const newQty = currentQty - item.quantity;
                    await updateDoc(productRef, {
                        quantity: newQty,
                        updatedAt: serverTimestamp(),
                    });
                }
            }

            // ✅ 5. Clear Cart after checkout
            clearCart();
            clearCart?.(); // if your context has clearCart()

            // ✅ 6. Navigate to Success Page
            navigate("/payment-success");
        } catch (err) {
            console.error(err);
            setError("Failed to place order. Try again.");
        }
    };

    if (loading) return <p className="text-center mt-10">Loading checkout...</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
            <h1 className="text-3xl font-bold mb-6 text-[#056EA5]">Checkout</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 mt-1"
                    />
                </div>

                <div>
                    <label className="block font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 mt-1"
                    />
                </div>

                <div>
                    <label className="block font-medium">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 mt-1"
                    />
                </div>

                <div>
                    <label className="block font-medium">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 mt-1"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium">City</label>
                        <input
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Postal Code</label>
                        <input
                            type="text"
                            name="postalCode"
                            value={form.postalCode}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-medium">Country</label>
                    <input
                        type="text"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 mt-1"
                    />
                </div>

                {/* ✅ Cart Preview */}
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <h3 className="font-semibold mb-2">Order Summary</h3>
                    {cart.map((item: { id: React.Key | null | undefined; title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; quantity: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
                        <div key={item.id} className="text-sm flex justify-between mb-1">
                            <span>{item.title}</span>
                            <span>Qty: {item.quantity}</span>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={() => navigate("/shop")}
                        className="px-6 py-3 rounded-full font-semibold shadow border"
                        style={{ color: "#056EA5", borderColor: "#056EA5" }}
                    >
                        Continue Shopping
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 rounded-full text-white font-semibold shadow"
                        style={{ background: "linear-gradient(to right, #056EA5, #034F7B)" }}
                    >
                        Place Order
                    </button>
                </div>
            </form>
        </div>
    );
}
