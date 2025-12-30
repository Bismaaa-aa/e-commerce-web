import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const accent = "#056EA5";

export default function Cart() {
  const { cart, addItem, decreaseItem, removeItem, userEmail } = useCart();
  const navigate = useNavigate();
  const [stockMap, setStockMap] = useState<{ [key: string]: number }>({});

  // Load latest stock for cart items
  const fetchStock = async () => {
    const map: { [key: string]: number } = {};
    for (const item of cart) {
      const snap = await getDoc(doc(db, "products", item.id));
      map[item.id] = snap.exists() ? snap.data().quantity : 0;
    }
    setStockMap(map);
  };

  useEffect(() => {
    fetchStock();
  }, [cart]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleIncrease = (item: any) => {
    const available = stockMap[item.id] ?? 0;
    if (item.quantity < available) addItem(item);
    else alert(`No more stock for "${item.title}"`);
  };

  const handleDecrease = (item: any) => decreaseItem(item);
  const handleRemove = (item: any) => removeItem(item.id);

  const continueShopping = () => navigate("/shop");

  const proceedToCheckout = async () => {
    // Validate stock before sending to backend
    for (const item of cart) {
      const available = stockMap[item.id] ?? 0;
      if (item.quantity > available) {
        alert(`Not enough stock for "${item.title}". Max available: ${available}`);
        return;
      }
    }

    try {
      const res = await fetch("http://localhost:5000/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: cart }),
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Checkout failed. Please try again.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6">
        <h2 className="text-2xl font-semibold" style={{ color: accent }}>
          Your cart is empty.
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-white to-gray-100 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: accent }}>
        🛒 Shopping Cart
      </h1>

      <div className="space-y-4">
        {cart.map(item => {
          const maxStock = stockMap[item.id] ?? 0;
          const reachedLimit = item.quantity >= maxStock;

          return (
            <div
              key={item.id}
              className="flex justify-between items-center border p-4 bg-white rounded-2xl shadow-sm"
              style={{ borderColor: accent }}
            >
              <div className="flex-1">
                <h2 className="font-semibold text-gray-800 text-lg">{item.title}</h2>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">Stock available: {maxStock}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDecrease(item)}
                  disabled={item.quantity === 1}
                  className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition disabled:opacity-50"
                >
                  −
                </button>

                <span className="font-medium w-6 text-center">{item.quantity}</span>

                <button
                  onClick={() => handleIncrease(item)}
                  disabled={reachedLimit || maxStock === 0}
                  className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition disabled:opacity-50"
                >
                  +
                </button>

                <button
                  onClick={() => handleRemove(item)}
                  className="text-red-500 text-xl hover:scale-110 transition"
                >
                  🗑
                </button>
              </div>

              {reachedLimit && (
                <p className="text-xs text-red-500 ml-2">Max quantity reached</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-8 text-xl font-bold bg-white p-4 rounded-2xl shadow">
        <span>Total:</span>
        <span style={{ color: accent }}>${total.toFixed(2)}</span>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={continueShopping}
          className="px-6 py-2 rounded-full border font-medium"
          style={{ color: accent, borderColor: accent }}
        >
          Continue Shopping
        </button>

        <button
          onClick={proceedToCheckout}
          className="px-6 py-2 rounded-full text-white font-medium"
          style={{ background: accent }}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
