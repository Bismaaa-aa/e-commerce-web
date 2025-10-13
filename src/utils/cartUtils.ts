export const addToCart = (product: any) => {
    try {
        console.log("🛒 addToCart called with:", product);

        // Get existing cart (or start with an empty array)
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");

        // Check if product already exists
        const existingItem = cart.find((item: any) => item.id === product.id);

        if (existingItem) {
            // Increase quantity
            existingItem.quantity += 1;
            console.log(`🔁 Increased quantity for: ${product.title}`);
        } else {
            // Add new product with quantity = 1
            cart.push({ ...product, quantity: 1 });
            console.log(`✨ Added new item: ${product.title}`);
        }

        // Save updated cart to localStorage
        localStorage.setItem("cart", JSON.stringify(cart));
        console.log("✅ Cart saved:", cart);
    } catch (error) {
        console.error("❌ Error adding to cart:", error);
    }
};
