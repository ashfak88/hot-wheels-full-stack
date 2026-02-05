import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "react-toastify";
import api from "../api/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"))
      if (loggedUser) {
        setUser(loggedUser)
      } else {
        setUser(null)
        setCart([])
        setLoading(false)
      }
    }

    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    const fetchCart = async () => {
      try {
        const res = await api.get(`/cart/${user._id}`);
        setCart(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const saveCartToBackend = async (updatedCart) => {
    setCart(updatedCart);

    if (!user?._id) return;

    try {
      const res = await api.put(`/cart/${user._id}`, {
        cartItems: updatedCart.map((item) => ({
          product: item?.product?._id,
          quantity: item.quantity,
        })),
      });
      return res.data;
    } catch (err) {
      console.error("Failed to update cart:", err);
      toast.error("Cloud sync failed. Check your connection.");
    }
  };

  const addToCart = async (product, quantity = 1) => {
    const exists = cart.find((item) => item.product._id === product._id);

    let result;
    if (exists) {
      result = await saveCartToBackend(
        cart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        ),
      );
    } else {
      result = await saveCartToBackend([...cart, { product, quantity }]);
    }

    toast.success("Added to cart!");
    return result;
  };

  const removeFromCart = (productId) => {
    const updated = cart.filter((item) => item.product._id !== productId);
    saveCartToBackend(updated);
    toast.success("Removed from cart!");
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    saveCartToBackend(
      cart.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = (skipBackend = false) => {
    if (skipBackend) {
      setCart([]);
    } else {
      saveCartToBackend([]);
    }
  };

  const cartCount = Array.isArray(cart)
    ? cart.reduce((total, item) => total + (item.quantity || 0), 0)
    : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setUser,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
