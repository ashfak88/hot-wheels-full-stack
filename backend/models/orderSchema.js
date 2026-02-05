const mongoose = require("mongoose");

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
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        userName: {
            type: String
        },
        orderId: {
            type: String,
            unique: true,
            required: true
        },
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
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
