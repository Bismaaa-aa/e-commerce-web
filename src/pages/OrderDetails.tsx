import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function OrderDetails() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            const docRef = doc(db, "orders", orderId);
            const snap = await getDoc(docRef);
            if (snap.exists()) setOrder(snap.data());
        };

        fetchOrder();
    }, [orderId]);

    if (!order) return <p className="p-6">Loading order...</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>

            <div className="border p-4 rounded-md mb-4">
                <p><strong>Order ID:</strong> {orderId}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> Rs {order.totalAmount}</p>
                <p className="text-sm text-gray-500">
                    <strong>Date:</strong> {order.orderDate?.toDate().toLocaleString()}
                </p>
            </div>

            <h3 className="font-semibold mb-2">Items</h3>
            {order.items.map((item, i) => (
                <div key={i} className="flex gap-4 border p-4 mb-3 rounded-md">
                    <img src={item.img} alt="" className="w-20 h-20 object-cover" />
                    <div>
                        <p className="font-semibold">{item.name}</p>
                        <p>Qty: {item.qty}</p>
                        <p>Price: Rs {item.price}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
