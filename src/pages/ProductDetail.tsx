import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cartUtils";
import fallbackImage from "../assets/mkp.jpg";

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    images?: string[];
    brand?: string;
    category?: string;
}

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState<string>("");
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (!id) return;
        fetch(`https://dummyjson.com/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setMainImage(data.thumbnail || "");
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;

        try {
            await addToCart(
                {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    thumbnail: product.thumbnail,
                    brand: product.brand,
                    category: product.category,
                },
                quantity
            );
            alert(`✅ ${product.title} added to cart!`);
            navigate("/cart");
        } catch (error) {
            alert("Failed to add item to cart. Please try again.");
        }
    };

    if (loading)
        return (
            <div className="h-screen flex justify-center items-center text-[#023859] text-xl bg-gradient-to-b from-blue-50 via-white to-blue-50">
                Loading...
            </div>
        );

    if (!product)
        return (
            <div className="h-screen flex justify-center items-center text-[#023859] text-xl bg-gradient-to-b from-blue-50 via-white to-blue-50">
                Product not found 😢
            </div>
        );

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-r from-[#E6F0FA] via-white to-[#DCEBFA] overflow-hidden">
            {/* Optional soft background glow */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(5,110,165,0.05),_transparent_70%)] pointer-events-none"></div>

            {/* Main Card */}
            <div className="relative z-10 w-[85vw] max-w-6xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md bg-white/80 border border-gray-200">
                {/* Left Section - Image */}
                <div className="md:w-1/2 flex flex-col justify-center items-center p-6 bg-gradient-to-br from-[#F8FBFF] to-[#EAF4FF]">
                    <div className="flex-1 flex justify-center items-center">
                        {mainImage ? (
                            <img
                                src={mainImage}
                                alt={product.title}
                                onError={(event) => {
                                    const target = event.currentTarget;
                                    if (target.src !== fallbackImage) {
                                        target.src = fallbackImage;
                                        setMainImage(fallbackImage);
                                    }
                                }}
                                className="w-[280px] h-[280px] object-cover rounded-3xl shadow-lg hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-[280px] h-[280px] flex items-center justify-center bg-gray-100 rounded-2xl text-gray-600 font-semibold shadow-inner">
                                No Image
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    <div className="flex justify-center gap-3 mt-4 flex-wrap">
                        {product.images?.slice(0, 4).map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt={`${product.title}-${i}`}
                                onClick={() => setMainImage(img)}
                                onError={(event) => {
                                    const target = event.currentTarget;
                                    if (target.src !== fallbackImage) {
                                        target.src = fallbackImage;
                                    }
                                }}
                                className={`w-16 h-16 object-cover rounded-xl cursor-pointer border-2 shadow-md transition-all ${mainImage === img
                                    ? "border-[#056EA5] scale-110"
                                    : "border-transparent hover:scale-105 hover:shadow-lg"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Section - Product Info */}
                <div className="md:w-1/2 flex flex-col justify-between p-8 bg-white/70 backdrop-blur-md">
                    <div>
                        <h1 className="text-3xl font-bold text-[#023859] mb-3">
                            {product.title}
                        </h1>
                        <p className="text-gray-700 text-base leading-relaxed mb-6">
                            {product.description || "No description available."}
                        </p>
                    </div>

                    {/* Price & Quantity */}
                    <div className="flex flex-col gap-6">
                        <p className="text-3xl font-extrabold text-[#056EA5]">
                            ${product.price.toFixed(2)}
                        </p>

                        <div className="flex items-center gap-4">
                            <span className="text-lg font-semibold text-[#023859]">
                                Quantity:
                            </span>
                            <div className="flex items-center gap-2 bg-[#F0F7FF] px-4 py-2 rounded-lg border border-[#BFD7ED]">
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="text-[#056EA5] text-xl font-bold px-2 hover:scale-110 transition-transform"
                                >
                                    -
                                </button>
                                <span className="text-lg font-semibold text-[#023859] w-6 text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="text-[#056EA5] text-xl font-bold px-2 hover:scale-110 transition-transform"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-gradient-to-r from-[#056EA5] to-[#023859] text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
                            >
                                🛒 Add to Cart
                            </button>
                            <button
                                onClick={() => navigate(-1)}
                                className="flex-1 border border-[#056EA5] text-[#056EA5] hover:bg-[#056EA5] hover:text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm"
                            >
                                ← Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
