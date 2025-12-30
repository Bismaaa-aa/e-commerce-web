import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import fallbackImage from "../assets/mkp.jpg";

interface Product {
    id: string;
    title: string;
    description?: string;
    price: number;
    image?: string;
    quantity: number;
}

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addItem, cart, requireLogin, userEmail } = useCart();

    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:5000/products/public/products/${id}`);
                if (!res.ok) throw new Error("Failed to fetch product");
                const data = await res.json();
                const found = data.find((p: any) => p.id === id);
                if (!found) throw new Error("Product not found");

                setProduct({
                    id: found.id,
                    title: found.title,
                    description: found.description || "",
                    price: found.price,
                    image: found.image,
                    quantity: found.quantity || 0,
                });
            } catch (err) {
                console.error(err);
                alert("Failed to load product. Try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;

        if (!userEmail) {
            await requireLogin();
            return;
        }

        const cartItem = cart.find((c) => c.id === product.id);
        const currentQty = cartItem ? cartItem.quantity : 0;
        if (currentQty + quantity > product.quantity) {
            alert(`Only ${product.quantity - currentQty} items available`);
            return;
        }

        addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity,
            thumbnail: product.image || fallbackImage,
            stock: product.quantity,
        });

        alert(`✅ ${product.title} added to cart!`);
        navigate("/cart");
    };

    if (loading) return <div className="h-screen flex justify-center items-center">Loading...</div>;
    if (!product) return <div className="h-screen flex justify-center items-center">Product not found 😢</div>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#E6F0FA] via-white to-[#DCEBFA] p-6">
            <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
                {/* Left - Image */}
                <div className="md:w-1/2 flex justify-center items-center p-6">
                    <img
                        src={product.image || fallbackImage}
                        alt={product.title}
                        className="w-80 h-80 object-cover rounded-2xl"
                    />
                </div>

                {/* Right - Info */}
                <div className="md:w-1/2 p-8 flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#023859]">{product.title}</h1>
                        <p className="text-gray-700 mt-4">{product.description || "No description available."}</p>
                        <p className="text-2xl font-extrabold text-[#056EA5] mt-6">${product.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-500 mt-1">Stock: {product.quantity}</p>
                    </div>

                    <div className="mt-6 flex items-center gap-4">
                        <span>Quantity:</span>
                        <div className="flex items-center border rounded px-3 py-1 gap-2">
                            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity((q) => Math.min(product.quantity, q + 1))}>+</button>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.quantity <= 0}
                            className={`flex-1 py-3 rounded-lg text-white font-semibold ${product.quantity <= 0 ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-[#056EA5] to-[#034F7B]"}`}
                        >
                            {product.quantity <= 0 ? "Out of Stock" : "🛒 Add to Cart"}
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex-1 py-3 border border-[#056EA5] rounded-lg text-[#056EA5] hover:bg-[#056EA5] hover:text-white transition-all"
                        >
                            ← Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
