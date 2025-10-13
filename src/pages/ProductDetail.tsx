import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cartUtils";

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    images?: string[];
}

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState<string>("");

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        fetch(`https://dummyjson.com/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setMainImage(data.thumbnail || "");
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            alert(`✨ ${product.title} added to your cart 🛍️`);
            navigate("/cart");
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex justify-center items-center text-[#023859] text-xl">
                Loading... 💖
            </div>
        );

    if (!product)
        return (
            <div className="min-h-screen flex justify-center items-center text-[#023859] text-xl">
                Product not found 😢
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col lg:flex-row justify-center items-center p-10 gap-10 relative">
            {/* Left Content */}
            <div className="max-w-md space-y-6 bg-white/70 backdrop-blur-lg border border-[#023859] rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all">
                <h1 className="text-4xl font-bold text-[#023859]">
                    {product.title || "Untitled Product"}
                </h1>
                <p className="text-[#023859] text-lg">
                    {product.description || "No description available."}
                </p>

                <p className="text-3xl font-bold text-pink-600">
                    💸 ${product.price?.toFixed(2) || "0.00"}
                </p>

                <div className="flex gap-4 mt-6">
                    <button
                        onClick={handleAddToCart}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-lg transition"
                    >
                        🛒 Add to Cart
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className="border border-[#023859] text-[#023859] px-6 py-3 rounded-full font-semibold hover:bg-[#023859]/10 transition"
                    >
                        ← Back
                    </button>
                </div>
            </div>

            {/* Right Product Image Section */}
            <div className="relative flex flex-col items-center">
                <div className="absolute -top-6 -left-6 w-80 h-80 bg-[#023859]/20 rounded-full blur-3xl opacity-30"></div>
                {mainImage ? (
                    <img
                        src={mainImage}
                        alt={product.title}
                        className="w-[400px] h-[400px] object-cover rounded-3xl shadow-xl z-10 relative hover:scale-105 transition-transform"
                    />
                ) : (
                    <div className="w-[400px] h-[400px] flex items-center justify-center bg-[#023859]/10 rounded-3xl text-[#023859] font-semibold">
                        No Image
                    </div>
                )}

                <div className="flex gap-3 justify-center mt-5">
                    {product.images && product.images.length > 0 ? (
                        product.images.slice(0, 4).map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt={`${product.title}-${i}`}
                                onClick={() => setMainImage(img)}
                                className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 ${mainImage === img
                                    ? "border-[#023859] scale-110"
                                    : "border-transparent hover:scale-105"
                                    } transition-all`}
                            />
                        ))
                    ) : (
                        <div className="text-[#023859]/70">No thumbnails</div>
                    )}
                </div>
            </div>

            {/* Decorative floating hearts */}
            <div className="fixed bottom-6 right-6 text-3xl animate-bounce">💖</div>
            <div className="fixed top-10 left-8 text-3xl animate-pulse">🌸</div>
            <div className="fixed top-1/2 right-10 text-3xl animate-bounce">🩷</div>
        </div>
    );
}
