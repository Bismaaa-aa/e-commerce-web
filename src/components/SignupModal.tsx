import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { auth, googleProvider, facebookProvider } from "../firebase"; // single import
import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithPopup,
} from "firebase/auth";

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

export default function SignupModal({
    isOpen,
    onClose,
    onSwitchToLogin,
}: SignupModalProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    // Email/password signup
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: fullName });
            }

            console.log("User signed up:", userCredential.user);
            onClose();
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Google signup
    const handleGoogleSignup = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log("Google user:", result.user);
            onClose();
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Facebook signup
    const handleFacebookSignup = async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            console.log("Facebook user:", result.user);
            onClose();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative p-8">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
                >
                    <X size={20} />
                </button>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center text-[#023859] mb-2">
                    CREATE ACCOUNT
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Join us today — it’s quick and easy!
                </p>

                {error && <p className="text-red-500 text-center mb-2">{error}</p>}

                {/* Form */}
                <form className="space-y-4" onSubmit={handleSignup}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#056EA5] focus:outline-none"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#056EA5] focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#056EA5] focus:outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Re-enter your password"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#056EA5] focus:outline-none"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Signup Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#023859] text-white font-semibold py-2 rounded-full hover:bg-[#04547E] transition"
                    >
                        SIGN UP
                    </button>

                    {/* Divider */}
                    <div className="flex items-center my-4">
                        <hr className="flex-1 border-gray-300" />
                        <span className="px-3 text-gray-500 text-sm">OR SIGN UP WITH</span>
                        <hr className="flex-1 border-gray-300" />
                    </div>

                    {/* Social Logins */}
                    <div className="flex justify-center gap-4">
                        <button
                            type="button"
                            onClick={handleGoogleSignup}
                            className="border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition"
                        >
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                className="w-5 h-5"
                            />
                        </button>
                        <button
                            type="button"
                            onClick={handleFacebookSignup}
                            className="border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition"
                        >
                            <img
                                src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                                alt="Facebook"
                                className="w-5 h-5"
                            />
                        </button>
                    </div>

                    {/* Already have an account */}
                    <p className="text-center text-sm text-gray-600 mt-4">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                            className="text-[#056EA5] font-medium hover:underline"
                        >
                            Log In
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}
