const Product = require("../models/productSchema");

const getAllProducts = async (req, res) => {
  try {
    const { category, priceRange, search, page = 1, limit = 6 } = req.query;

    let query = {};

    if (category && category !== "all") {
      query.category = category.toLowerCase();
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (priceRange && priceRange !== "all") {
      if (priceRange === "under-500") query.price = { $lt: 500 };
      else if (priceRange === "500-1000")
        query.price = { $gte: 500, $lte: 1000 };
      else if (priceRange === "above-1000") query.price = { $gt: 1000 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: parseInt(page),
      totalProducts,
    });
  } catch (err) {
    console.error("Fetch products error:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

const restoreStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    await Product.findByIdAndUpdate(req.params.productId, {
      $inc: { stock: quantity },
    });
    res.json({ message: "Stock restored" });
  } catch (err) {
    res.status(500).json({ message: "Failed to restore stock" });
  }
};

const addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Add product error:", err);
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Failed to add product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};

module.exports = {
  getAllProducts,
  restoreStock,
  addProduct,
  updateProduct,
  deleteProduct,
};
