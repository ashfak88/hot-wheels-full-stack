import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCart } from "./CartContext";
import api from "../api/api";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const { addToCart } = useCart();

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await api.get(`/wishlist/${user._id}`);
        setWishlist(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch wishlist failed:", err);
        setWishlist([]);
      }
    };

    fetchWishlist();
  }, [user?._id, user?.accessToken]);

  const addToWishlist = async (product) => {
    if (!user) return toast.error("Login required");

    const exists = wishlist.find((item) => item?.product?._id === product._id);
    if (exists) return toast.info("Already in wishlist");

    try {
      await api.post("/wishlist/add", {
        userId: user._id,
        productId: product._id
      });

      setWishlist((prev) => [...prev, { product }]);
      toast.success("Added to wishlist");
    } catch {
      toast.error("Failed to add wishlist");
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;

    try {
      await api.delete(`/wishlist/${user._id}/${productId}`);

      setWishlist((prev) =>
        prev.filter((item) => item?.product?._id !== productId)
      );

    } catch {
      toast.error("Failed to remove");
    }
  };

  /* ================= MOVE TO CART ================= */
  const moveToCart = async (product) => {
    if (!user) return toast.error("Login required");

    try {
      // 1️⃣ Add to cart using CartContext (handles MongoDB)
      await addToCart(product, 1);

      await removeFromWishlist(product._id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to move to cart");
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        moveToCart,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
