import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import OrderConfirmation from "./pages/OrderConfirmation";
import { ShoppingBag, Sun, Moon } from "lucide-react";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  // Update the <html> class and localStorage when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <Router>
      {/* HEADER */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#056EA5]/90 to-[#023859]/90 backdrop-blur-md px-6 py-3 flex justify-between items-center shadow-md">
        <Link
          to="/home"
          className="flex items-center gap-2 font-bold text-xl text-white hover:scale-105 transform transition duration-300"
        >
          <ShoppingBag size={28} /> MyShop
        </Link>

        <div className="flex gap-4 items-center">
          <Link
            to="/shop"
            className="px-4 py-2 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition duration-200"
          >
            Products
          </Link>
          <Link
            to="/cart"
            className="px-4 py-2 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition duration-200"
          >
            🛒 Cart
          </Link>

          {/* Dark/Light Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition duration-200 text-white"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      {/* ROUTES */}
      <Routes>
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/home" element={<Home />} />
        <Route path="/shop" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        {/* Redirect root to /home */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
