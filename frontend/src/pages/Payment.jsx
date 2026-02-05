import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

const Payment = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [upiId, setUpiId] = useState("");
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();
  const { cart, loading, clearCart } = useCart();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      toast.warning("Please log in before proceeding to payment.");
      navigate("/login");
      return;
    }
    setLoggedInUser(user);

    if (loading) return;

    const urlParams = new URLSearchParams(window.location.search);
    const isSingleBuy = urlParams.get("single") === "true";

    let items = [];
    if (isSingleBuy) {
      const singleCar = JSON.parse(localStorage.getItem("selectedCar"));
      if (singleCar) {
        items = [{
          _id: singleCar._id,
          name: singleCar.name,
          price: singleCar.price,
          qty: singleCar.qty || 1
        }];
      }
    } else {

      items = cart
        .filter((item) => item.product !== null && item.product !== undefined)
        .map((item) => ({
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          qty: item.quantity,
        }));
    }

    if (items.length === 0 && !loading && !isOrderPlaced) {
      toast.info("Your cart is empty. Add items before checkout.")
      navigate(isSingleBuy ? "/" : "/cart");
      return;
    }

    setCartItems(items);
  }, [navigate, cart, loading, isOrderPlaced]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!address || !phone) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    if (paymentMethod === "card" && !cardNumber) {
      toast.error("Please enter your card number.");
      return;
    }

    if (paymentMethod === "upi" && !upiId) {
      toast.error("Please enter your UPI ID.");
      return;
    }

    // Double check user exists before placement
    const freshUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!freshUser || !freshUser._id) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/orders/place",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${freshUser.accessToken}`,
          },
          body: JSON.stringify({
            userId: freshUser._id,
            address,
            phone,
            paymentMethod,
            items: cartItems.map((item) => ({
              product: item._id,
              quantity: item.qty || 1,
              price: item.price
            }))
          })
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to place order");

      setIsOrderPlaced(true);
      toast.success("🎉 Payment Successful! Order placed successfully.");

      clearCart();
      localStorage.removeItem("selectedCar");

      setTimeout(() => navigate("/shipping"), 1500);
    } catch (error) {
      console.error("Order saving failed:", error);
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-6 sm:px-10 lg:px-20">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-orange-700 mb-8">
        Payment Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <form
          onSubmit={handlePayment}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Billing Details
          </h2>

          <div>
            <label className="block text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              value={loggedInUser?.name || ""}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your shipping address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Phone</label>
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Payment Method</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Credit / Debit Card
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                UPI
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Cash on Delivery
              </label>
            </div>
          </div>

          {paymentMethod === "card" && (
            <div>
              <label className="block text-gray-600 mb-1">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="XXXX XXXX XXXX XXXX"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                maxLength="16"
              />
            </div>
          )}

          {paymentMethod === "upi" && (
            <div>
              <label className="block text-gray-600 mb-1">UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="example@upi"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-3 rounded-lg text-lg font-semibold transition duration-300 ${isProcessing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-700 text-white hover:bg-orange-600"
              }`}
          >
            {isProcessing ? "Processing..." : "Confirm Payment"}
          </button>
        </form>

        <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Order Summary
          </h2>

          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between py-3">
                <p className="text-gray-700 font-medium">
                  {item.name} × {item.qty}
                </p>
                <p className="text-gray-800 font-semibold">
                  ₹{item.price * item.qty}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6 border-t pt-4">
            <p className="text-xl font-semibold text-gray-800">Total</p>
            <p className="text-xl font-bold text-orange-700">
              ₹{totalPrice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
