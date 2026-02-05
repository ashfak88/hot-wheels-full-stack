import { useState, useEffect } from "react";
import { useAdmin } from "./context/AdminContext";
import Swal from "sweetalert2";

import { Edit3, Plus, Trash2 } from "lucide-react";
import AdminAddProducts from "./AdminAddProducts";

import { useDebounce } from "../../hooks/useDebounce";

export default function AdminProducts() {
  const { products, deleteProduct, fetchProducts, totalPages } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchProducts({ search: debouncedSearch, page, limit: 10 });
  }, [debouncedSearch, page]);

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 ml-40 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-semibold">Manage Products</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset to page 1 on search
              }}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
            >
              <Plus size={18} /> Add Product
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-800 text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!products ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-slate-400">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-slate-400">No products found.</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="border-t border-gray-800">
                    <td className="p-3">
                      <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded-lg" />
                    </td>
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">₹ {p.price}</td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3 flex items-center justify-center gap-4">
                      <button onClick={() => handleEdit(p)} className="text-blue-400 hover:text-blue-300 mx-2">
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={async () => {
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
                            await deleteProduct(p.id);
                            Swal.fire({
                              title: "Deleted!",
                              text: "Product has been deleted.",
                              icon: "success",
                              background: "#111827",
                              color: "#fff",
                            });
                          }
                        }}
                        className="text-red-500 hover:text-red-400 mx-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg bg-gray-800 ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"}`}
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-gray-900 rounded-lg">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
            disabled={page >= totalPages}
            className={`px-4 py-2 rounded-lg bg-gray-800 ${page >= totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"}`}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <AdminAddProducts
          onClose={() => setIsModalOpen(false)}
          editingProduct={editingProduct}
        />
      )}
    </div>
  );
}