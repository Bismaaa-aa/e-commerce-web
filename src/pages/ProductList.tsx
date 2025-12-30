import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { MessageCircle } from "lucide-react";
import { collection, onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";
import fallbackImage from "../assets/mkp.jpg";

interface Product {
    _id: string;
    title: string;
    price: number;
    description?: string;
    imageUrl: string;
    featured?: boolean;
    quantity: number; // stock
}

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { addItem, userEmail, requireLogin, cart } = useCart();

    // ----- Real-time listener -----
    useEffect(() => {
        setLoading(true);
        const unsubscribe = onSnapshot(
            collection(db, "products"),
            snapshot => {
                const formatted: Product[] = snapshot.docs.map(doc => ({
                    _id: doc.id,
                    title: doc.data().title,
                    price: doc.data().price,
                    description: doc.data().description || "",
                    imageUrl: doc.data().image || "",
                    featured: doc.data().featured || false,
                    quantity: doc.data().quantity || 0,
                }));
                setProducts(formatted);
                setLoading(false);
            },
            err => {
                console.error(err);
                setError("Failed to load products.");
                setLoading(false);
            }
        );

        return () => unsubscribe(); // cleanup
    }, []);

    const handleAddToCart = async (product: Product) => {
        if (!userEmail) {
            await requireLogin();
            return;
        }

        const cartItem = cart.find(c => c.id === product._id);
        const currentQty = cartItem ? cartItem.quantity : 0;

        if (currentQty >= product.quantity) {
            alert(`Cannot add more than ${product.quantity} of "${product.title}"`);
            return;
        }

        addItem({
            id: product._id,
            title: product.title,
            price: product.price,
            quantity: 1,
            thumbnail: product.imageUrl || fallbackImage,
            stock: product.quantity,
        });

        alert(`${product.title} added to cart`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 text-gray-800 flex flex-col">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-[#056EA5] via-[#034F7B] to-[#023859] text-white py-20 text-center shadow-md">
                <h2 className="text-4xl font-extrabold mb-4 drop-shadow">Discover Quality Products</h2>
                <p className="text-lg mb-6 opacity-90">Shop the latest and greatest with confidence.</p>
                <button
                    onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                    className="inline-block bg-white text-[#023859] font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition-all duration-300"
                >
                    Browse Collection
                </button>
            </section>

            {/* Products Section */}
            <main id="products" className="flex-1 max-w-7xl mx-auto px-6 py-16">
                <h3 className="text-3xl font-semibold text-gray-800 text-center mb-10">Featured Products</h3>

                {loading && <p className="text-center text-gray-600 py-10">Loading products...</p>}
                {!loading && error && (
                    <div className="text-center text-red-500 py-10">
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && products.length === 0 && (
                    <p className="text-center text-gray-600 py-10">No products available. Please check back later.</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
                    {products.map(p => {
                        const cartItem = cart.find(c => c.id === p._id);
                        const currentQty = cartItem ? cartItem.quantity : 0;
                        const outOfStock = currentQty >= p.quantity;

                        return (
                            <div
                                key={p._id}
                                className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                            >
                                <div className="relative">
                                    <img
                                        src={p.imageUrl || fallbackImage}
                                        alt={p.title}
                                        onError={e => { if (e.currentTarget.src !== fallbackImage) e.currentTarget.src = fallbackImage; }}
                                        className="w-full h-60 object-cover"
                                    />
                                    {p.featured && (
                                        <span className="absolute top-3 right-3 bg-gradient-to-r from-[#056EA5] to-[#023859] text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                                            Featured
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col justify-between p-5">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{p.title}</h3>
                                        <p className="text-gray-700 font-bold mb-2">${p.price.toFixed(2)}</p>
                                        <p className="text-sm text-gray-500 mb-2">Stock: {p.quantity - currentQty}</p>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <button
                                            onClick={() => handleAddToCart(p)}
                                            disabled={outOfStock || p.quantity <= 0}
                                            className={`flex-1 text-white text-sm font-medium py-2 rounded-md ${outOfStock
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-gradient-to-r from-[#056EA5] to-[#034F7B] hover:opacity-90"
                                                }`}
                                        >
                                            {outOfStock ? "Out of Stock" : "Add to Cart"}
                                        </button>

                                        <Link
                                            to={`/product/${p._id}`}
                                            className="flex-1 border border-[#056EA5] text-[#056EA5] hover:bg-[#056EA5] hover:text-white text-sm font-medium py-2 rounded-md text-center transition-all"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            <button
                onClick={() => navigate("/faqs")}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-[#056EA5] to-[#034F7B] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all"
                title="Frequently Asked Questions"
            >
                <MessageCircle size={28} />
            </button>
        </div>
    );
}
