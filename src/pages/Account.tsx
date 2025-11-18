import { auth } from "../firebase";
import type { User } from "firebase/auth";
import { useState } from "react";
import { LogOut, User2, Package } from "lucide-react";

interface AccountProps {
    user: User; // ✅ Now guaranteed non-null because we only render Account if user exists
}

export default function Account({ user }: AccountProps) {
    const [tab, setTab] = useState("profile");

    return (
        <div className="min-h-screen bg-gray-100 py-10 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-4">

                {/* ✅ Sidebar */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-6">
                    <div className="text-center">
                        <img
                            src={
                                user.photoURL ||
                                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                            }
                            className="w-20 h-20 rounded-full border border-gray-300 dark:border-gray-600 object-cover mx-auto"
                            alt="user"
                        />
                        <h3 className="text-xl font-semibold mt-3 text-gray-900 dark:text-gray-100">
                            {user.displayName || "Anonymous User"}
                        </h3>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                    </div>

                    <div className="space-y-3 text-gray-700 dark:text-gray-300">
                        <button
                            className={`flex items-center gap-3 w-full text-left p-2 rounded-lg ${tab === "profile" ? "bg-black text-white" : ""
                                }`}
                            onClick={() => setTab("profile")}
                        >
                            <User2 size={18} /> My Profile
                        </button>

                        <button
                            className={`flex items-center gap-3 w-full text-left p-2 rounded-lg ${tab === "orders" ? "bg-black text-white" : ""
                                }`}
                            onClick={() => setTab("orders")}
                        >
                            <Package size={18} /> My Orders
                        </button>

                        <button
                            onClick={() => auth.signOut()}
                            className="flex items-center gap-3 w-full text-left text-red-500 font-medium p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>

                {/* ✅ Main Content */}
                <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow p-8">
                    {tab === "profile" && <ProfileTab user={user} />}
                    {tab === "orders" && <OrdersTab />}
                </div>
            </div>
        </div>
    );
}

/* ✅ Profile Tab */
function ProfileTab({ user }: { user: User }) {
    return (
        <>
            <h2 className="text-2xl font-bold mb-6 text-[#056EA5] dark:text-[#5BC0EB]">
                My Profile
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                    <strong>Name:</strong> {user.displayName || "Anonymous User"}
                </p>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
            </div>
        </>
    );
}

/* ✅ Orders Tab */
function OrdersTab() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-[#056EA5] dark:text-[#5BC0EB]">
                My Orders
            </h2>
            <p className="text-gray-500 dark:text-gray-400">No orders found.</p>
        </div>
    );
}
