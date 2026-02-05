import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/api"; // Corrected import path
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!loggedInUser) {
            navigate("/login");
            return;
        }
        setUser(loggedInUser);
        fetchOrders(loggedInUser.id);
    }, [navigate]);

    const fetchOrders = async (userId) => {
        try {
            const res = await api.get(`/orders/${userId}`);
            setOrders(res.data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            toast.error("Failed to load your orders.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl text-gray-600">Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800">
                    My <span className="text-orange-600">Orders</span>
                </h1>

                {orders.length === 0 ? (
                    <div className="text-center bg-white p-10 rounded-xl shadow-md">
                        <p className="text-gray-500 text-lg mb-4">You haven't placed any orders yet.</p>
                        <button
                            onClick={() => navigate("/products")}
                            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <motion.div
                                key={order.orderId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                            >
                                <div className="bg-gray-100 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Order ID</p>
                                        <p className="font-mono font-semibold text-gray-700">{order.orderId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-semibold text-gray-700">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Amount</p>
                                        <p className="font-bold text-green-600">₹{order.totalAmount}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${order.status === "Delivered"
                                                ? "bg-green-100 text-green-700"
                                                : order.status === "Cancelled"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-blue-100 text-blue-700"
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                                <img
                                                    src={item.product?.image || "https://via.placeholder.com/80"} // Fallback image if product is missing
                                                    alt={item.product?.name || "Product"}
                                                    className="w-16 h-16 object-cover rounded-md border"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-800">{item.product?.name || "Unknown Product"}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Qty: {item.quantity} × ₹{item.price}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserOrders;
