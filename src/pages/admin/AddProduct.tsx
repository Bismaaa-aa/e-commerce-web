import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState(""); // <-- description state
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();

    const token = localStorage.getItem("adminToken"); // store JWT token in localStorage after login

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !description || !price || !quantity || !image) {
            alert("All fields are required!");
            return;
        }

        try {
            setUploading(true);

            // Upload image to backend (Cloudinary)
            const formData = new FormData();
            formData.append("image", image);

            const uploadRes = await axios.post(
                "http://localhost:5000/admin/upload-image",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const imageUrl = uploadRes.data.url;

            // Add product
            await axios.post(
                "http://localhost:5000/admin/products",
                {
                    title,
                    description, // <-- send description
                    price: parseFloat(price),
                    quantity: parseInt(quantity),
                    image: imageUrl,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Product added successfully!");
            navigate("/admin/dashboard"); // go back to admin dashboard
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.error || "Something went wrong");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-10">
            <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="flex flex-col">
                    Title
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border rounded px-2 py-1"
                        required
                    />
                </label>

                <label className="flex flex-col">
                    Description
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border rounded px-2 py-1"
                        required
                    />
                </label>

                <label className="flex flex-col">
                    Price ($)
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="border rounded px-2 py-1"
                        required
                    />
                </label>

                <label className="flex flex-col">
                    Quantity
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="border rounded px-2 py-1"
                        required
                    />
                </label>

                <label className="flex flex-col">
                    Image
                    <input type="file" accept="image/*" onChange={handleImageChange} required />
                </label>

                <button
                    type="submit"
                    disabled={uploading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {uploading ? "Uploading..." : "Add Product"}
                </button>
            </form>
        </div>
    );
}
