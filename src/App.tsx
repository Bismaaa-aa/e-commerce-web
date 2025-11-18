import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import OrderConfirmation from "./pages/OrderConfirmation";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import ProtectedAccount from "./pages/ProtectedAccount";
import FAQSection from "./pages/FAQSection";

import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";

// ✅ Firebase imports
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

import {
  ShoppingBag,
  ShoppingCart,
  Sun,
  Moon,
} from "lucide-react";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Detect Firebase user login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Load Theme
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") setDarkMode(true);
  }, []);

  // ✅ Apply Theme
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setMenuOpen(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <Router>
      {/* ✅ NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* ✅ Logo */}
          <Link
            to="/home"
            className="flex items-center gap-2 font-bold text-2xl text-[#056EA5] dark:text-[#5BC0EB] hover:text-[#023859] dark:hover:text-[#89D4F5] hover:scale-105 transition-transform"
          >
            <ShoppingBag size={26} className="text-[#056EA5] dark:text-[#5BC0EB]" />
            <span>ShopEase</span>
          </Link>

          {/* ✅ Navbar Links */}
          <div className="flex items-center gap-6 text-[#056EA5] dark:text-[#5BC0EB] font-medium">
            <Link
              to="/home"
              className="hover:text-[#023859] dark:hover:text-[#89D4F5] transition-colors"
            >
              Home
            </Link>

            <Link
              to="/shop"
              className="hover:text-[#023859] dark:hover:text-[#89D4F5] transition-colors"
            >
              Products
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-1 hover:text-[#023859] dark:hover:text-[#89D4F5] transition-colors"
            >
              <ShoppingCart size={18} className="text-[#056EA5] dark:text-[#5BC0EB]" /> Cart
            </Link>

            {/* ✅ User Menu */}
            {user ? (
              <div
                className="relative"
                onClick={(e) => e.stopPropagation()} // prevent dropdown from closing immediately
              >
                <button
                  className="flex items-center gap-2 hover:text-[#056EA5]"
                  onClick={() => setMenuOpen((prev) => !prev)}
                >
                  <img

                    src={
                      user.photoURL ||
                      "https://cdn-icons-png.flaticon.com/512/847/847969.png" // ✅ Default blank avatar
                    }
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
                    alt="user"

                  />
                  <span>{user.displayName || "My Account"}</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md mt-2">
                    <Link
                      to="/account"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Account
                    </Link>

                    <button
                      onClick={() => {
                        auth.signOut();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="hover:text-[#056EA5]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 19.5a8.25 8.25 0 1 1 15 0"
                  />
                </svg>
              </button>
            )}



          </div>
        </div>
      </nav>

      {/* ✅ ROUTES */}
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/shop" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order/:orderId" element={<OrderDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account" element={<ProtectedAccount user={user} />} />
        <Route path="/faqs" element={<FAQSection />} /> {/* ✅ NEW ROUTE */}

        {/* ✅ Protected Account Route */}
        <Route
          path="/account"
          element={user ? <Account user={user} /> : <Navigate to="/home" />}
        />
      </Routes>

      {/* ✅ MODALS */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />
      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    </Router>
  );
}
