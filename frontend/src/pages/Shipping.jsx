import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Footer from "../components/Footer";

const Shipping = () => {
  const navigate = useNavigate();

  // ✅ Logged-in user
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ORDERS ================= */
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/orders/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(data.reverse());
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, user?._id]);

  /* ================= RESTORE STOCK ================= */
  const restoreStock = async (items) => {
    for (const item of items) {
      try {
        await fetch(
          `http://localhost:5000/api/products/${item.product._id}/restore`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.accessToken}`,
            },
            body: JSON.stringify({
              quantity: item.quantity,
            }),
          }
        );
      } catch (err) {
        console.error("Error restoring stock:", err);
      }
    }
  };

  /* ================= CANCEL ORDER ================= */
  const handleCancelOrder = async (orderId) => {
    const result = await Swal.fire({
      title: "Cancel Order?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "No",
    });

    if (!result.isConfirmed) return;

    try {
      const order = orders.find((o) => o.orderId === orderId);
      if (!order) return;

      // restore stock
      await restoreStock(order.items);

      // update order status in backend
      await fetch(
        `http://localhost:5000/api/orders/${user._id}/${orderId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      // update UI instantly
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, status: "Cancelled" } : o
        )
      );

      Swal.fire({
        title: "Cancelled!",
        text: "Your order has been cancelled and stock restored.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Failed to cancel order. Try again later.",
        icon: "error",
      });
    }
  };

  /* ================= STATUS COLOR ================= */
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-orange-700 mb-10">
          My Orders & Shipping
        </h2>

        {loading ? (
          <div className="max-w-4xl mx-auto space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 rounded-2xl h-32"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-lg text-gray-600 mb-4">
              You don’t have any orders yet.
            </p>
            <button
              onClick={() => navigate("/Products")}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-8">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white border shadow-lg rounded-2xl p-6"
              >
                {/* HEADER */}
                <div className="flex justify-between border-b pb-4 mb-4">
                  <div>
                    <h3 className="font-semibold">
                      Order ID:{" "}
                      <span className="text-orange-600">
                        {order.orderId}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-500">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* ITEMS */}
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center border-b pb-3"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded object-cover"
                      />

                      <div className="flex-1 ml-4">
                        <p className="font-medium">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <span className="font-semibold">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="flex justify-between mt-4 font-semibold">
                  <span>Total Amount</span>
                  <span>
                    ₹
                    {order.items.reduce(
                      (acc, item) =>
                        acc + item.price * item.quantity,
                      0
                    )}
                  </span>
                </div>

                {/* ADDRESS */}
                <div className="mt-3 text-sm text-gray-600">
                  <p>
                    <strong>Tracking ID:</strong>{" "}
                    {order.trackingId || "Not Assigned"}
                  </p>
                  <p>
                    <strong>Shipping Address:</strong> {order.address}
                  </p>
                </div>

                {/* ACTION */}
                {order.status !== "Cancelled" &&
                  order.status !== "Delivered" && (
                    <div className="mt-5 flex justify-end">
                      <button
                        onClick={() =>
                          handleCancelOrder(order.orderId)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Shipping;
