import React, { useEffect, useState, useRef } from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const productsRef = useRef(null);

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isInWishlist = (id) =>
    Array.isArray(wishlist) &&
    wishlist.some((item) => item?.product?._id === id);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        category: selectedCategory,
        priceRange,
        search: debouncedSearch,
        page: currentPage,
        limit: 6,
      });

      const response = await fetch(
        `http://localhost:5000/api/products?${queryParams.toString()}`,
      );
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, priceRange, debouncedSearch, currentPage]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    setLoggedInUser(user);
  }, []);

  const addToMyCars = (product) => {
    if (!loggedInUser) {
      toast.warning("Please log in before adding items to your cart.", {
        autoClose: 1000,
      });
      setTimeout(() => navigate("/login"));
      return;
    }
    addToCart(product);
  };

  const paginate = (num) => setCurrentPage(num);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const getPageNumbers = () => {
    const max = 5;
    const pages = [];

    if (totalPages <= max) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      );
    }

    return pages;
  };

  const [categories, setCategories] = useState(["all"]);
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const allProducts = Array.isArray(data) ? data : data.products || [];
        const uniqueCategories = [
          "all",
          ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <>
      <div className="bg-gray-100 py-10 px-6 sm:px-10 lg:px-20 min-h-screen">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 tracking-tight text-orange-700">
          Hot Wheels
        </h1>

        <div className="mb-8 bg-gray-100 p-6 rounded-lg">
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800"
                >
                  <option value="all">All Prices</option>
                  <option value="under-500">Under ₹500</option>
                  <option value="500-1000">₹500 - ₹1000</option>
                  <option value="above-1000">Above ₹1000</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Products
                </label>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => {
                setSelectedCategory("all");
                setPriceRange("all");
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-orange-700 text-white rounded-md hover:bg-orange-600 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div
          ref={productsRef}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12 min-h-[500px]"
        >
          {loading ? (
            <div className="col-span-full text-center py-8">
              <p className="text-xl text-gray-600 animate-pulse">
                Loading products...
              </p>
            </div>
          ) : products.length > 0 ? (
            products.map((p) => {
              const liked = isInWishlist(p._id);
              return (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden w-80 mx-auto flex flex-col"
                >
                  <div className="w-full h-80 overflow-hidden relative group">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-grow justify-between text-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-1">
                        {p.name}
                      </h2>
                      <p className="text-gray-900 font-bold text-lg mb-1">
                        ₹{p.price}
                      </p>

                      {p.stock > 0 ? (
                        <p className="text-green-600 font-medium mb-4">
                          In Stock ({p.stock} left)
                        </p>
                      ) : (
                        <p className="text-red-600 font-medium mb-4">
                          Out of Stock
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (!loggedInUser) {
                            toast.warning("Please log in to Add wishlist.");
                            navigate("/login");
                            return;
                          }
                          const productId = p._id;
                          liked
                            ? removeFromWishlist(productId)
                            : addToWishlist(p);
                        }}
                        className="p-2 transition"
                      >
                        <FaHeart
                          className={`text-2xl ${
                            liked
                              ? "text-red-500"
                              : "text-gray-400 hover:text-red-400"
                          }`}
                        />
                      </button>

                      <button
                        onClick={() =>
                          p.stock > 0
                            ? addToMyCars(p)
                            : toast.error("Out of stock!", { autoClose: 1000 })
                        }
                        disabled={p.stock <= 0}
                        className={`flex-1 py-2 rounded-lg transition ${
                          p.stock > 0
                            ? "bg-orange-700 text-white hover:bg-orange-600"
                            : "bg-gray-400 text-white cursor-not-allowed"
                        }`}
                      >
                        {p.stock > 0 ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-xl text-gray-600">
                No products found matching your filters.
              </p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mb-8">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              <SlArrowLeft />
            </button>

            {getPageNumbers().map((num, i) => (
              <button
                key={i}
                onClick={() => typeof num === "number" && paginate(num)}
                disabled={num === "..."}
                className={`px-4 py-2 rounded-md ${
                  currentPage === num
                    ? "bg-[#FD5600] text-white"
                    : num === "..."
                      ? "bg-transparent text-gray-500 cursor-default"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              <SlArrowRight />
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Products;
