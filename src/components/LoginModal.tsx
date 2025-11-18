import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { auth, googleProvider, facebookProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToSignup: () => void; // switch to signup
}

export default function LoginModal({
    isOpen,
    onClose,
    onSwitchToSignup,
}: LoginModalProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    // Email/password login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log("User logged in:", userCredential.user);
            onClose();
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Social login helper
    const handleSocialLogin = async (provider: typeof googleProvider | typeof facebookProvider) => {
        setError("");

        try {
            await signInWithPopup(auth, provider);
            onClose();
        } catch (err: any) {

            // ✅ Handle popup blocked
            if (err.code === "auth/popup-blocked") {
                console.warn("Popup blocked — using redirect instead.");
                try {
                    // Fallback open google page to allow popup
                    window.open("https://accounts.google.com/", "_blank", "width=500,height=600");

                    // Try again after permission granted
                    await signInWithPopup(auth, provider);
                    onClose();
                } catch (err2: any) {
                    console.error(err2);
                    setError(err2.message);
                }
            } else {
                console.error(err);
                setError(err.message);
            }
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
                    WELCOME
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Sign in to your account
                </p>

                {error && <p className="text-red-500 text-center mb-2">{error}</p>}

                {/* Form */}
                <form className="space-y-4" onSubmit={handleLogin}>
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
                                placeholder="Enter your password"
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

                    {/* Remember Me + Forgot Password */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-600">
                            <input type="checkbox" className="accent-[#056EA5]" /> Remember me
                        </label>
                        <a href="#" className="text-[#056EA5] hover:underline">
                            Forgot Password?
                        </a>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#023859] text-white font-semibold py-2 rounded-full hover:bg-[#04547E] transition"
                    >
                        LOGIN
                    </button>

                    {/* Divider */}
                    <div className="flex items-center my-4">
                        <hr className="flex-1 border-gray-300" />
                        <span className="px-3 text-gray-500 text-sm">OR LOGIN WITH</span>
                        <hr className="flex-1 border-gray-300" />
                    </div>

                    {/* Social Logins */}
                    <div className="flex justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin(googleProvider)}
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
                            onClick={() => handleSocialLogin(facebookProvider)}
                            className="border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition"
                        >
                            <img
                                src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                                alt="Facebook"
                                className="w-5 h-5"
                            />
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-gray-600 mt-4">
                        Don’t have an account?{" "}
                        <button
                            type="button"
                            onClick={onSwitchToSignup}
                            className="text-[#056EA5] font-medium hover:underline"
                        >
                            Sign Up
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}
