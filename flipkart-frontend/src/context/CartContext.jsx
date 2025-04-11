import { createContext, useContext, useState, useEffect } from "react";
import cartAPI from "../services/cartAPI";
import auth from "../config"; // Firebase auth import
import { onAuthStateChanged } from "firebase/auth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState("");
    const [cartLoading, setCartLoading] = useState(true); // Added loading state

    // Fetch user ID from Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                fetchCart(user.uid);
                setUserName(user.email)
            } else {
                setUserId(null);
                setCart([]); // Clear cart if user logs out
                setCartLoading(false); // Ensure loading is false when logged out
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchCart(userId);
        }
    }, [userId]);

    // Fetch Cart from MongoDB
    const fetchCart = async (userId) => {
        if (!userId) {
            setCart([]);
            setCartLoading(false);
            return;
        }

        try {
            setCartLoading(true); // Start loading before fetching
            const response = await cartAPI.get(`/api/cart/${userId}`);
            setCart(response.data || []);
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setCartLoading(false); // Stop loading after fetching
        }
    };

    // Save Cart to MongoDB
    const saveCart = async (updatedItems) => {
        if (!userId) return;

        const updatedCart = { ...cart, items: updatedItems };
        setCart(updatedCart);

        try {
            await cartAPI.post("/api/cart", { userId, items: updatedItems });
        } catch (error) {
            console.error("Error saving cart:", error);
        }
    };

    // Add to Cart
    const addToCart = async (product) => {
        try {
            await cartAPI.post("/api/cart", {
                userId,
                items: [
                    {
                        productId: product._id,
                        quantity: 1 // Default to 1
                    }
                ]
            });

            // Fetch updated cart from backend
            const updatedCart = await cartAPI.get(`/api/cart/${userId}`);

            // Update the state immediately
            setCart(updatedCart.data);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    // Remove from Cart
    const removeFromCart = async (id) => {
        try {
            console.log("Removing product:", id);
            console.log("User ID:", userId);
            await cartAPI.delete(`/api/cart/${userId}/${id}`);
            setCart((prevCart) => {
                const updatedItems = prevCart.items.filter((product) => product.productId._id !== id);
                return { ...prevCart, items: updatedItems };
            });
        } catch (error) {
            console.error("Error removing product from cart:", error);
        }
    };

    // Update Quantity in MongoDB
    const updateQuantity = async (productId, type) => {
        if (!cart || !cart.items) return;

        const updatedCart = {
            ...cart,
            items: cart.items.map((item) => {
                if (item.productId._id === productId) {
                    const newQuantity = type === "increase"
                        ? item.quantity + 1
                        : Math.max(1, item.quantity - 1);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }),
        };

        setCart(updatedCart);

        try {
            await cartAPI.put(`/api/cart/${userId}`, {
                productId,
                quantity: updatedCart.items.find(item => item.productId._id === productId).quantity
            });
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    // Clear Cart (After Order Placement)
    const clearCart = async () => {
        if (!userId) return;

        setCart({ ...cart, items: [] }); // Keep cart structure intact

        try {
            await cartAPI.delete(`/api/cart/${userId}`);
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, setCart, saveCart, clearCart, userId, userName, cartLoading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
