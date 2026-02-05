import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdmin } from "./context/AdminContext";
import { motion } from 'framer-motion'
import { toast } from "react-toastify";
export default function AdminAddProducts({ onClose, editingProduct }) {
  const { addProduct, editProduct } = useAdmin()
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if running as a modal or a standalone page
  const isModal = typeof onClose === 'function';

  // If not a modal, check if we have editingProduct in navigation state
  const productToEdit = editingProduct || location.state?.editingProduct;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    image: "",

  });

  useEffect(() => {
    if (productToEdit) setFormData(productToEdit);
  }, [productToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.stock || !formData.category || !formData.image) {
      toast.error("All fields are required!");
      return;
    }

    if (isNaN(formData.price) || Number(formData.price) < 0) {
      toast.error("Price must be a valid positive number!");
      return;
    }

    if (isNaN(formData.stock) || Number(formData.stock) < 0) {
      toast.error("Stock must be a valid positive number!");
      return;
    }

    if (productToEdit) {
      await editProduct(productToEdit.id, formData);
      toast.success("Product updated successfully!");
    } else {
      await addProduct(formData);
      toast.success("Product added successfully!");
    }

    if (isModal) {
      onClose();
    } else {
      navigate('/admin/products');
    }
  };

  const handleClose = () => {
    if (isModal) {
      onClose();
    } else {
      navigate('/admin/products');
    }
  }

  const content = (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`bg-gray-900 p-8 rounded-2xl w-full max-w-lg shadow-lg border border-gray-800 ${!isModal ? 'mx-auto mt-10' : ''}`}
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {productToEdit ? "Edit Product" : "Add Product"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
        />


        {formData.image && (
          <div className="mt-4 flex justify-center">
            <img
              src={formData.image}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border border-gray-700"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
          >
            {productToEdit ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </motion.div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/60  backdrop-blur flex justify-center items-center text-white z-50">
        {content}
      </div>
    );
  }

  return content;
}