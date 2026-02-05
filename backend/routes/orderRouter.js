const express = require("express")
const { authMiddleware } = require("../middlware/authMiddleware")
const orderController = require("../controllers/orderController")

const router = express.Router()

// User Routes
router.post("/place", authMiddleware, orderController.placeOrder)
router.get("/:userId", authMiddleware, orderController.getUserOrders)
router.patch("/:userId/:orderId", authMiddleware, orderController.cancelOrder)

module.exports = router

