import api from "../../../api/api";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const AdminContext = createContext();
export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Admin: Failed to fetch stats", error);
    }
  };


  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async ({ search = "", page = 1, limit = 10 } = {}) => {
    try {
      const res = await api.get(`/admin/products`, {
        params: { search, page, limit }
      });
      const productsWithId = (res.data.products || []).map((p) => ({
        ...p,
        id: p._id,
      }));
      setProducts(productsWithId);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Admin: Failed to fetch products", error);
    }
  };


  const [totalUserPages, setTotalUserPages] = useState(1);
  const [totalOrderPages, setTotalOrderPages] = useState(1);

  const fetchUsers = async ({ search = "", page = 1, limit = 10 } = {}) => {
    try {
      const res = await api.get("/admin/users", {
        params: { search, page, limit }
      });
      const usersWithId = (res.data.users || []).map((u) => ({ ...u, id: u._id }));
      setUsers(usersWithId);
      setTotalUserPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Admin: Failed to fetch users", error);
    }
  }


  const fetchOrders = async ({ search = "", page = 1, limit = 10 } = {}) => {
    try {
      const res = await api.get("/admin/orders", {
        params: { search, page, limit }
      });
      const ordersWithId = (res.data.orders || []).map((order) => ({
        ...order,
        id: order.orderId || order._id,
      }));
      setOrders(ordersWithId);
      setTotalOrderPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Admin: Failed to fetch orders", error);
    }
  };


  const addProduct = async (newProduct) => {
    try {
      const res = await api.post("/admin/products", newProduct);
      setProducts((prev) => [...prev, res.data]);
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };


  const editProduct = async (id, updatedProduct) => {
    try {
      const res = await api.put(`/admin/products/${id}`, updatedProduct);
      const productWithId = { ...res.data, id: res.data._id };
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? productWithId : p))
      );
    } catch (error) {
      toast.error("Failed to update product");
    }
  };


  const updateUser = async (id, updatedData) => {
    try {
      const res = await api.patch(`/admin/users/${id}`, updatedData);
      const userWithId = { ...res.data, id: res.data._id };
      setUsers(prev =>
        prev.map(user =>
          user.id === id ? userWithId : user
        )
      );
      return res.data;
    } catch (error) {
      toast.error("Failed to update user");
      throw error;
    }
  };


  const deleteUser = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      toast.error("Failed to delete user");
      throw error;
    }
  };


  const updateOrderStatus = async (id, newStatus) => {
    try {
      const res = await api.patch(`/admin/orders/status/${id}`, {
        status: newStatus
      });


      setOrders(prev =>
        prev.map(order =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );

      return res.data;
    } catch (error) {
      toast.error("Failed to update order status");
      throw error;
    }
  };

  const deleteOrder = async (id) => {
    try {
      await api.delete(`/admin/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete order");
      fetchOrders();
    }
  };

  useEffect(() => {
    // No automatic fetching on login anymore.
    // Each page will fetch its own data on mount.
  }, []);

  return (
    <AdminContext.Provider
      value={{
        products,
        users,
        orders,
        addProduct,
        deleteProduct,
        editProduct,
        deleteOrder,
        updateOrderStatus,
        updateUser,
        deleteUser,
        stats,
        fetchStats,
        fetchProducts,
        fetchUsers,
        fetchOrders,
        totalPages,
        totalUserPages,
        totalOrderPages
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};