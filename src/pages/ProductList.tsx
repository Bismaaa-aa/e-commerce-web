import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addToCart } from "../utils/cartUtils";

interface Product {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
}

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("https://dummyjson.com/products")
            .then((res) => res.json())
            .then((data) => setProducts(data.products || []))
            .catch((err) => console.error(err));
    }, []);

    const handleAddToCart = (product: Product) => {
        addToCart(product);
        alert(`✨ ${product.title} added to your cart 🛍️`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#D0E6FA] via-[#FDE2F3] to-[#E0F7FA] p-8 relative">
            <h1 className="text-4xl font-extrabold text-center mb-12 text-[#023859] drop-shadow-lg">
                💕 Our Cute Product Collection 💕
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center">
                {products.map((p) => (
                    <div
                        key={p.id}
                        className="bg-white rounded-3xl border-2 border-[#023859] shadow-md p-6 flex flex-col items-center text-center transition-all hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br from-[#E0F2FF] to-[#FFF0F5]"
                    >
                        <div className="relative">
                            <img
                                src={p.thumbnail || ""}
                                alt={p.title || "Product"}
                                className="w-48 h-48 object-cover rounded-2xl mb-4 shadow-sm transition-transform hover:scale-110"
                            />
                            <span className="absolute top-2 right-2 bg-[#023859] text-white text-xs px-2 py-1 rounded-full shadow">
                                ✨ New
                            </span>
                        </div>

                        <h2 className="text-lg font-semibold text-[#023859] mb-1">
                            {p.title.length > 25 ? p.title.slice(0, 25) + "..." : p.title}
                        </h2>

                        <p className="text-[#034F7B] font-bold text-lg mb-4">
                            💸 ${p.price}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleAddToCart(p)}
                                className="bg-gradient-to-r from-[#056EA5] to-[#023859] text-white px-4 py-2 rounded-full font-medium shadow-md hover:scale-105 hover:shadow-lg transition"
                            >
                                🛒 Add to Cart
                            </button>

                            <Link
                                to={`/product/${p.id}`}
                                className="border-2 border-[#023859] text-[#023859] px-4 py-2 rounded-full font-medium hover:bg-[#023859]/10 transition"
                            >
                                👀 View
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating cute elements */}
            <div className="fixed bottom-6 right-6 text-3xl animate-bounce">💖</div>
            <div className="fixed top-10 left-8 text-3xl animate-pulse">🌸</div>
            <div className="fixed top-1/2 right-10 text-3xl animate-bounce">🩷</div>
            <div className="fixed bottom-20 left-20 text-3xl animate-pulse">⭐</div>
        </div>
    );
}
