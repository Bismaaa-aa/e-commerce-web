import { useState, useEffect } from "react";
import axios from "axios";

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
    featured: boolean;
}

export default function AdminDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const token = localStorage.getItem("adminToken");

    // Fetch products on mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:5000/admin/products", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(res.data);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        }
    };

    // Handle image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
    };

    // Add new product
    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !price || !quantity || !image) {
            alert("All fields are required");
            return;
        }

        try {
            setUploading(true);

            // Upload image
            const formData = new FormData();
            formData.append("image", image);

            const uploadRes = await axios.post(
                "http://localhost:5000/admin/upload-image",
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const imageUrl = uploadRes.data.url;

            // Add product to backend
            await axios.post(
                "http://localhost:5000/admin/products",
                {
                    title,
                    description,
                    price: parseFloat(price),
                    quantity: parseInt(quantity),
                    image: imageUrl,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Reset form
            setTitle("");
            setDescription("");
            setPrice("");
            setQuantity("");
            setImage(null);
            setUploading(false);

            fetchProducts(); // Refresh product list
        } catch (err) {
            console.error("Failed to add product:", err);
            setUploading(false);
            alert("Failed to add product.");
        }
    };

    // Update quantity
    const handleQuantityChange = async (id: string, newQty: number) => {
        if (newQty < 0) return;

        try {
            await axios.patch(
                `http://localhost:5000/admin/products/${id}`,
                { quantity: newQty },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setProducts((prev) =>
                prev.map((p) => (p.id === id ? { ...p, quantity: newQty } : p))
            );
        } catch (err) {
            console.error("Failed to update quantity:", err);
            alert("Failed to update quantity.");
        }
    };

    // Delete product
    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`http://localhost:5000/admin/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setProducts((prev) => prev.filter((p) => p.id !== id));
            alert("Product deleted successfully!");
        } catch (err) {
            console.error("Failed to delete product:", err);
            alert("Failed to delete the product.");
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* Add Product Form */}
            <div className="mb-8 p-6 border rounded shadow bg-white">
                <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
                <form className="flex flex-col gap-3" onSubmit={handleAddProduct}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border px-2 py-1 rounded"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border px-2 py-1 rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="border px-2 py-1 rounded"
                        step="0.01"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="border px-2 py-1 rounded"
                        required
                    />
                    <input type="file" onChange={handleImageChange} required />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                        disabled={uploading}
                    >
                        {uploading ? "Uploading..." : "Add Product"}
                    </button>
                </form>
            </div>

            {/* Product List */}
            <div className="p-6 border rounded shadow bg-white">
                <h2 className="text-2xl font-semibold mb-4">Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((p) => (
                        <div
                            key={p.id}
                            className="border rounded p-4 flex flex-col items-center"
                        >
                            <img
                                src={p.image}
                                alt={p.title}
                                className="w-40 h-40 object-cover mb-2"
                            />
                            <h3 className="font-semibold">{p.title}</h3>
                            <p>${p.price}</p>
                            <p>Stock: {p.quantity}</p>
                            <p className="text-sm mt-1">{p.description}</p>
                            <div className="flex gap-2 mt-2">
                                <button
                                    className="px-2 py-1 bg-green-500 text-white rounded"
                                    onClick={() => handleQuantityChange(p.id, p.quantity + 1)}
                                >
                                    +1
                                </button>
                                <button
                                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                                    onClick={() => handleQuantityChange(p.id, p.quantity - 1)}
                                    disabled={p.quantity === 0}
                                >
                                    -1
                                </button>
                                <button
                                    className="px-2 py-1 bg-red-600 text-white rounded"
                                    onClick={() => handleDelete(p.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
