import { motion } from "framer-motion";
import { useAdmin } from "./context/AdminContext";
import { UserX } from "lucide-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useDebounce } from "../../hooks/useDebounce";

export default function AdminUsers() {
  const { users, updateUser, deleteUser, fetchUsers, totalUserPages } = useAdmin();
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchUsers({ search: debouncedSearch, page, limit: 10 });
  }, [debouncedSearch, page]);

  const handleRoleChange = async (id, newRole) => {
    setUpdatingUserId(id);
    try {
      await updateUser(id, { role: newRole });
      Swal.fire({
        title: "Success",
        text: "User role updated successfully!",
        icon: "success",
        background: "#111827",
        color: "#fff",
      });
    } catch (error) {
      console.error('Failed to update user role:', error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingUserId(id);
    try {
      await updateUser(id, { status: newStatus });
      Swal.fire({
        title: "Success",
        text: `User ${newStatus === "active" ? "Unblocked" : "Blocked"} successfully!`,
        icon: "success",
        background: "#111827",
        color: "#fff",
      });
    } catch (error) {
      console.error('Failed to update user status:', error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (id) => {
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
        await deleteUser(id);
        Swal.fire({
          title: "Deleted!",
          text: "User has been deleted.",
          icon: "success",
          background: "#111827",
          color: "#fff",
        });
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 flex justify-center ml-40">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 sm:p-8 w-full max-w-6xl shadow-[0_0_40px_rgba(255,255,255,0.05)] overflow-hidden"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-2 gap-4">
          <h2 className="text-3xl sm:text-4xl font-[Cinzel] tracking-[0.25em] text-slate-100">
            Manage Users
          </h2>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 w-full md:w-64"
          />
        </div>

        {users.length === 0 ? (
          <p className="text-center text-slate-400">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead className="bg-gray-800 text-slate-300 uppercase tracking-wider">
                <tr>
                  <th className="p-3 sm:p-4 text-left">Name</th>
                  <th className="p-3 sm:p-4 text-left">Email</th>
                  <th className="p-3 sm:p-4 text-center">Status</th>
                  <th className="p-3 sm:p-4 text-center">Role</th>
                  <th className="p-3 sm:p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-gray-800 hover:bg-gray-800/40 transition-all duration-200"
                  >
                    <td className="p-3 sm:p-4 text-slate-100 whitespace-nowrap">
                      {u.name}
                    </td>

                    <td className="p-3 sm:p-4 text-slate-400 whitespace-nowrap">
                      {u.email}
                    </td>

                    <td className="p-3 sm:p-4 text-center">
                      <button
                        onClick={() =>
                          handleStatusChange(
                            u.id,
                            u.status === "active" ? "blocked" : "active"
                          )
                        }
                        disabled={updatingUserId === u.id}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${u.status === "active" ? "bg-green-500" : "bg-red-500"
                          } ${updatingUserId === u.id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                          }`}
                      >
                        <motion.div
                          animate={{ x: u.status === "active" ? 26 : 2 }}
                          className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      </button>
                    </td>

                    <td className="p-3 sm:p-4 text-center">
                      <select
                        value={u.role || "user"}
                        onChange={(e) =>
                          handleRoleChange(u.id, e.target.value)
                        }
                        disabled={updatingUserId === u.id}
                        className={`bg-gray-800 text-slate-200 px-2 sm:px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-slate-400 ${updatingUserId === u.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="p-3 sm:p-4 flex items-center justify-center gap-3 sm:gap-4">
                      <button
                        className="text-red-500 hover:text-red-400 transition"
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={updatingUserId === u.id}
                      >
                        <UserX size={18} />
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
            Page {page} of {totalUserPages}
          </span>
          <button
            onClick={() => setPage((prev) => (prev < totalUserPages ? prev + 1 : prev))}
            disabled={page >= totalUserPages}
            className={`px-4 py-2 rounded-lg bg-gray-800 ${page >= totalUserPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"}`}
          >
            Next
          </button>
        </div>
      </motion.div>
    </div>
  );
}