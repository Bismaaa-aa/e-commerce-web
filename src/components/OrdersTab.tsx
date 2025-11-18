// 📁 src/components/OrdersTab.tsx
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import type { User } from "firebase/auth";

interface OrdersTabProps {
    user: User;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ user }) => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const q = query(
                    collection(db, "orders"),
                    where("userId", "==", user.uid),
                    orderBy("date", "desc")
                );

                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user.uid]);

    if (loading) return <p>Loading your orders...</p>;

    if (orders.length === 0)
        return <p className="text-gray-500">No orders found.</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">My Orders</h2>
            {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <p className="font-semibold">
                        🧾 Order ID: <span className="text-gray-500">{order.id}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Placed on:{" "}
                        {order.date?.toDate
                            ? order.date.toDate().toLocaleString()
                            : "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                        Total: <strong>${order.totalPrice.toFixed(2)}</strong>
                    </p>
                </div>
            ))}
        </div>
    );
};
