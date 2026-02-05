import { Eye, Trash2 } from "lucide-react";
import { useAdmin } from "./context/AdminContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useDebounce } from "../../hooks/useDebounce";

export default function AdminOrders() {
  const { orders, deleteOrder, updateOrderStatus, users, fetchOrders, fetchUsers, totalOrderPages } = useAdmin();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchOrders({ search: debouncedSearch, page, limit: 10 });
    fetchUsers();
  }, [debouncedSearch, page]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getTotalPrice = (items) => {
    return items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  };

  const getTotalQty = (items) => {
    return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "#111827",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await deleteOrder(id);
        Swal.fire({
          title: "Deleted!",
          text: "Order has been deleted.",
          icon: "success",
          background: "#111827",
          color: "#fff",
        });
      } catch (error) {
        console.error("Failed to delete order:", error);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      toast.success(`Order status updated to ${newStatus}!`);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getUsernameFromEmail = (email) => {
    const user = users.find(user => user.email === email);
    return user?.username || user?.name || email;
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 flex justify-center ml-40">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 w-full max-w-6xl shadow-[0_0_40px_rgba(255,255,255,0.05)]"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h2 className="text-4xl text-center font-[Cinzel] tracking-[0.25em] text-slate-100">
            Manage Orders
          </h2>
          <input
            type="text"
            placeholder="Search orders (ID, email)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 w-full md:w-64"
          />
        </div>

        {orders.length === 0 ? (
          <p className="text-center text-slate-400">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-800 text-slate-300 text-sm uppercase tracking-wider">
                <tr>
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">User</th>
                  <th className="p-4 text-left">Total</th>
                  <th className="p-4 text-center">Quantity</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-gray-800 hover:bg-gray-800/40 transition-all duration-200"
                  >
                    <td className="p-4 text-slate-100">{order.orderId}</td>
                    <td className="p-4 text-slate-200">
                      {getUsernameFromEmail(order.email)}
                    </td>
                    <td className="p-4 text-slate-100">
                      ₹ {getTotalPrice(order.items)}
                    </td>
                    <td className="p-4 text-slate-100 text-center">
                      {getTotalQty(order.items)}
                    </td>
                    <td className="p-4 text-center">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="bg-gray-800 text-slate-200 px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-4 text-center flex items-center justify-center gap-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-400 hover:text-blue-300 transition"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(order.id)}
                        className="text-red-500 hover:text-red-400 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg bg-gray-800 ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"}`}
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-gray-900 rounded-lg text-white">
            Page {page} of {totalOrderPages}
          </span>
          <button
            onClick={() => setPage((prev) => (prev < totalOrderPages ? prev + 1 : prev))}
            disabled={page >= totalOrderPages}
            className={`px-4 py-2 rounded-lg bg-gray-800 ${page >= totalOrderPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"}`}
          >
            Next
          </button>
        </div>
      </motion.div>


      {selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-xl shadow-xl">
            <h2 className="text-2xl text-slate-100 mb-4">
              Order Details – {selectedOrder.orderId}
            </h2>

            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-slate-100 font-semibold">
                User: {getUsernameFromEmail(selectedOrder.email)}
              </p>
              <p className="text-slate-300 text-sm">
                Email: {selectedOrder.email}
              </p>
              <p className="text-slate-300 text-sm mt-2 border-t border-gray-700 pt-2">
                <span className="font-semibold text-slate-200">Address:</span> {selectedOrder.address || "N/A"}
              </p>
            </div>

            {selectedOrder.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-gray-800 p-3 rounded-lg mb-3"
              >
                <img
                  src={item.product?.image || "https://via.placeholder.com/100"}
                  alt={item.product?.name || "Product"}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <p className="text-slate-100 font-semibold">{item.product?.name || "Unknown Product"}</p>
                  <p className="text-slate-300 text-sm">
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>
              </div>
            ))}

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full mt-4 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}