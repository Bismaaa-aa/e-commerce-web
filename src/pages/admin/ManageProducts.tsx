// src/pages/admin/ManageProducts.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Product {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
    createdAt: any;
}

export default function ManageProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("adminToken"); // Admin token stored after login

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost:5000/admin/products", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProducts(res.data);
            } catch (err: any) {
                setError(err.response?.data?.error || "Failed to fetch products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [token]);

    if (loading) return <p className="p-4">Loading products...</p>;
    if (error) return <p className="p-4 text-red-600">{error}</p>;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={() => navigate("/admin/add-product")}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Add New Product
                </button>
            </div>

            {products.length === 0 ? (
                <div className="text-center mt-10">
                    <p className="mb-4 text-gray-600">No products found.</p>
                    <button
                        onClick={() => navigate("/admin/add-product")}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Add Your First Product
                    </button>
                </div>
            ) : (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-700">
                            <th className="border px-4 py-2">Image</th>
                            <th className="border px-4 py-2">Title</th>
                            <th className="border px-4 py-2">Price</th>
                            <th className="border px-4 py-2">Quantity</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((prod) => (
                            <tr key={prod.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                                <td className="border px-4 py-2">
                                    <img src={prod.image} alt={prod.title} className="w-16 h-16 object-cover" />
                                </td>
                                <td className="border px-4 py-2">{prod.title}</td>
                                <td className="border px-4 py-2">${prod.price.toFixed(2)}</td>
                                <td className="border px-4 py-2">{prod.quantity}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => navigate(`/admin/add-product?id=${prod.id}`)}
                                        className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                    {/* You can implement delete later */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
