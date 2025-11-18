// src/pages/MyOrders.tsx
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

interface Customer {
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface Item {
    id: number;
    title: string;
    price: number;
    quantity: number;
    thumbnail: string;
    brand?: string;
    category?: string;
}

interface Order {
    id: string;
    date: any;
    items: Item[];
    totalPrice: number;
    userId: string;
    customer?: Customer;
}

export default function MyOrders() {
    const [user] = useAuthState(auth);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                const q = query(
                    collection(db, "orders"),
                    where("userId", "==", user.uid)
                );

                const snap = await getDocs(q);
                const data = snap.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() } as Order))
                    .sort((a, b) => {
                        const dateA = a.date?.toDate
                            ? a.date.toDate().getTime()
                            : new Date(a.date).getTime();
                        const dateB = b.date?.toDate
                            ? b.date.toDate().getTime()
                            : new Date(b.date).getTime();
                        return dateB - dateA;
                    });

                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (!user)
        return <h2 className="text-center mt-10 text-lg">Login to view orders</h2>;
    if (loading)
        return <h2 className="text-center mt-10 text-lg">Loading orders...</h2>;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold mb-6">My Orders</h2>

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map((order) => {
                    const formattedDate =
                        order.date?.toDate
                            ? order.date.toDate().toLocaleString()
                            : new Date(order.date).toLocaleString();

                    return (
                        <div
                            key={order.id}
                            className="border border-gray-200 rounded-lg p-5 mb-6 bg-white shadow-sm hover:shadow-md transition"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-3">
                                <p className="font-semibold text-blue-600">
                                    Order #{order.id.slice(-6)}
                                </p>
                                <p className="text-sm text-gray-500">{formattedDate}</p>
                            </div>

                            {/* Customer Info */}
                            {order.customer && (
                                <div className="text-sm text-gray-600 mb-3">
                                    <p>
                                        <strong>Customer:</strong> {order.customer.name}
                                    </p>
                                    <p>
                                        <strong>Phone:</strong> {order.customer.phone}
                                    </p>
                                    <p>
                                        <strong>Address:</strong> {order.customer.address}
                                    </p>
                                </div>
                            )}

                            {/* Items List */}
                            <div className="divide-y divide-gray-200">
                                {order.items?.map((item, index) => (
                                    <div key={index} className="flex items-center py-3">
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="w-16 h-16 object-cover rounded-md border mr-4"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.brand} • {item.category}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                Qty: {item.quantity} × Rs {item.price}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-gray-800">
                                            Rs {(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center mt-4 pt-3 border-t">
                                <p className="text-gray-600 text-sm">
                                    Total Items: {order.items?.length}
                                </p>
                                <p className="font-bold text-lg">
                                    Total: Rs {order.totalPrice.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
