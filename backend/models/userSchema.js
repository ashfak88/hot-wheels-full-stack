const mongoose = require("mongoose");


const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    }
  },
  { _id: false }
);

const wishlistItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    }
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: Number,
    price: Number
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: String,
    items: [orderItemSchema],
    totalAmount: Number,
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "upi", "razorpay"],
      default: "cod"
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending"
    },
    address: String,
    phone: String,
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" },
    status: { type: String, default: "active" },
    cart: [cartItemSchema],
    wishlist: [wishlistItemSchema],
    orders: [orderSchema],
    refreshTokens: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
