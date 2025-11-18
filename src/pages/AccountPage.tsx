import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";

export default function AccountPage() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    if (!user) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-semibold mb-2">Please login to view your account.</h2>
                <p className="text-gray-500">You need to be logged in to access your profile and orders.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-10 bg-gray-100 dark:bg-gray-900">
            <h2 className="text-3xl font-bold mb-6 text-[#056EA5] dark:text-[#5BC0EB]">
                Welcome, {user.displayName || "User"}
            </h2>

            <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Profile Image */}
                <img
                    src={user.photoURL || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
                />

                {/* User Info */}
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <p className="text-lg">
                        <strong>Name:</strong> {user.displayName || "Anonymous User"}
                    </p>
                    <p className="text-lg">
                        <strong>Email:</strong> {user.email}
                    </p>
                    {user.phoneNumber && (
                        <p className="text-lg">
                            <strong>Phone:</strong> {user.phoneNumber}
                        </p>
                    )}
                </div>
            </div>

            {/* Optional: Orders Section */}
            <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                <h3 className="text-2xl font-bold mb-4 text-[#056EA5] dark:text-[#5BC0EB]">My Orders</h3>
                <p className="text-gray-500 dark:text-gray-400">No orders found yet.</p>
            </div>
        </div>
    );
}
