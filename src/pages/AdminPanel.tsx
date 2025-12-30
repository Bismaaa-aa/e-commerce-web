import React, { useEffect, useState } from "react";
import {
    collection, addDoc, doc, updateDoc, deleteDoc,
    onSnapshot, serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

export default function AdminPanel() {
    const [products, setProducts] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const [featured, setFeatured] = useState(true);

    const productsCol = collection(db, "products");

    useEffect(() => {
        const unsub = onSnapshot(productsCol, snap => {
            const items: any[] = [];
            snap.forEach(d => items.push({ id: d.id, ...d.data() }));
            setProducts(items);
        });
        return () => unsub();
    }, []);

    const addProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        await addDoc(productsCol, {
            title,
            price: Number(price),
            quantity: Number(quantity),
            featured,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        setTitle("");
        setPrice(0);
        setQuantity(0);
        setFeatured(true);
    };

    const updateQuantity = async (productId: string, newQty: number) => {
        if (newQty < 0) return; // ❌ prevent negative stock
        await updateDoc(doc(db, "products", productId), {
            quantity: newQty,
            updatedAt: serverTimestamp(),
        });
    };

    const toggleFeatured = async (productId: string, current: boolean) => {
        await updateDoc(doc(db, "products", productId), {
            featured: !current,
            updatedAt: serverTimestamp(),
        });
    };

    const deleteProduct = async (productId: string) => {
        await deleteDoc(doc(db, "products", productId));
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

            <form onSubmit={addProduct} className="space-y-3 mb-6">
                <input
                    className="border p-2 w-full rounded"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Product Title"
                    required
                />

                <input
                    className="border p-2 w-full rounded"
                    type="number"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    placeholder="Price"
                    step="0.01"
                    required
                />

                <input
                    className="border p-2 w-full rounded"
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    placeholder="Stock Quantity"
                    required
                />

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={featured}
                        onChange={e => setFeatured(e.target.checked)}
                    />
                    <label>Featured Product</label>
                </div>

                <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    Add Product
                </button>
            </form>

            <ul>
                {products.map(p => (
                    <li
                        key={p.id}
                        className="mb-3 p-3 border rounded flex justify-between items-center"
                    >
                        <div>
                            <div className="font-semibold">{p.title}</div>
                            <div>${p.price}</div>
                            <div>Stock: {p.quantity}</div>
                            <div>Status: {p.featured ? "🌟 Featured" : "Not Featured"}</div>
                        </div>

                        <div className="flex flex-col gap-2">
                            {/* ➕ increase stock */}
                            <button
                                onClick={() => updateQuantity(p.id, p.quantity + 1)}
                                className="border px-2 rounded"
                            >
                                +1 Stock
                            </button>

                            {/* ➖ decrease stock */}
                            <button
                                onClick={() => updateQuantity(p.id, p.quantity - 1)}
                                disabled={p.quantity === 0} // ✅ disable when 0
                                className="border px-2 rounded"
                            >
                                -1 Stock
                            </button>

                            {/* ⭐ toggle featured */}
                            <button
                                onClick={() => toggleFeatured(p.id, p.featured)}
                                className="border px-2 rounded text-yellow-600"
                            >
                                {p.featured ? "Remove Featured" : "Make Featured"}
                            </button>

                            {/* 🗑 delete */}
                            <button
                                onClick={() => deleteProduct(p.id)}
                                className="text-red-600 border px-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
