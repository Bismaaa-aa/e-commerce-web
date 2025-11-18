import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cartUtils";
import { auth } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { MessageCircle } from "lucide-react"; // FAQ icon from lucide-react
import fallbackImage from "../assets/mkp.jpg";

interface Product {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    description?: string;
    category?: string;
    brand?: string;
}

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch("https://dummyjson.com/products");
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const data = await response.json();
            setProducts(data.products || []);
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setError(
                "We couldn't load products right now. Please check your connection and try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const handleAddToCart = async (product: Product) => {
        try {
            await addToCart(product);

            const user = auth.currentUser;
            if (user) {
                const cartRef = doc(db, "carts", user.uid);
                const snapshot = await getDoc(cartRef);
                if (!snapshot.exists()) {
                    await setDoc(
                        cartRef,
                        {
                            customer: {
                                name: user.displayName || "",
                                email: user.email || "",
                                phone: "",
                                address: "",
                                items: [],
                            },
                            updatedAt: serverTimestamp(),
                        },
                        { merge: true }
                    );
                }
            }

            alert(`${product.title} added to your cart`);
        } catch (error) {
            const message =
                auth.currentUser && (error as any)?.code === "permission-denied"
                    ? "You do not have permission to add items. Please check your Firestore rules."
                    : "Failed to add item to cart. Please try again.";
            alert(message);
            console.error("Add to cart failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 text-gray-800 flex flex-col">
            {/* 🔹 Hero Section */}
            <section className="bg-gradient-to-r from-[#056EA5] via-[#034F7B] to-[#023859] text-white py-20 text-center shadow-md">
                <h2 className="text-4xl font-extrabold mb-4 drop-shadow">
                    Discover Quality Products
                </h2>
                <p className="text-lg mb-6 opacity-90">
                    Shop the latest and greatest with confidence and comfort.
                </p>
                <button
                    onClick={() => {
                        const productsSection = document.getElementById("products");
                        productsSection?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-block bg-white text-[#023859] font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition-all duration-300"
                >
                    Browse Collection
                </button>
            </section>

            {/* 🔹 Product Grid Section */}
            <main id="products" className="flex-1 max-w-7xl mx-auto px-6 py-16">
                <h3 className="text-3xl font-semibold text-gray-800 text-center mb-10">
                    Featured Products
                </h3>

                {loading && (
                    <p className="text-center text-gray-600 py-10">
                        Loading products...
                    </p>
                )}

                {!loading && error && (
                    <div className="text-center text-red-500 py-10">
                        <p className="mb-4">{error}</p>
                        <button
                            onClick={loadProducts}
                            className="px-6 py-2 rounded-full font-semibold shadow hover:scale-105 transition"
                            style={{
                                background: "linear-gradient(to right, #056EA5, #034F7B)",
                                color: "white",
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && products.length === 0 && (
                    <p className="text-center text-gray-600 py-10">
                        No products available right now. Please check back later.
                    </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
                    {products.map((p) => (
                        <div
                            key={p.id}
                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                        >
                            {/* Product Image */}
                            <div className="relative">
                                <img
                                    src={p.thumbnail}
                                    alt={p.title}
                                    onError={(event) => {
                                        const target = event.currentTarget;
                                        if (target.src !== fallbackImage) {
                                            target.src = fallbackImage;
                                        }
                                    }}
                                    className="w-full h-60 object-cover"
                                />
                                <span className="absolute top-3 right-3 bg-gradient-to-r from-[#056EA5] to-[#023859] text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                                    New
                                </span>
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 flex flex-col justify-between p-5">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate">
                                        {p.title}
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 font-bold mb-4">
                                        ${p.price.toFixed(2)}
                                    </p>
                                </div>

                                {/* ✅ Buttons Row */}
                                <div className="flex items-center justify-between gap-3 whitespace-nowrap">
                                    <button
                                        onClick={() => handleAddToCart(p)}
                                        className="flex-1 bg-gradient-to-r from-[#056EA5] to-[#023859] hover:opacity-90 text-white text-sm font-medium py-2 rounded-md transition-all duration-200"
                                    >
                                        Add to Cart
                                    </button>

                                    <Link
                                        to={`/product/${p.id}`}
                                        className="flex-1 border border-[#056EA5] text-[#056EA5] hover:bg-[#056EA5] hover:text-white text-sm font-medium py-2 rounded-md text-center transition-all duration-200"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* 🔹 Floating FAQ Icon */}
            <button
                onClick={() => navigate("/faqs")}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-[#056EA5] to-[#023859] text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-2xl transition-all duration-300"
                title="Frequently Asked Questions"
            >
                <MessageCircle size={28} />
            </button>
        </div>
    );
}
