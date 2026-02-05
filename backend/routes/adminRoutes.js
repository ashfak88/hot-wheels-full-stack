const express = require("express");
const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");
const { authMiddleware } = require("../middlware/authMiddleware");
const { adminMiddleware } = require("../middlware/adminMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/stats", adminController.getDashboardStats);

router.get("/users", adminController.getAllUsers);
router.get("/users/:userId", userController.getUserById);
router.patch("/users/:userId", userController.updateUser);
router.delete("/users/:userId", userController.deleteUser);

router.get("/products", productController.getAllProducts);
router.post("/products", productController.addProduct);
router.put("/products/:productId", productController.updateProduct);
router.delete("/products/:productId", productController.deleteProduct);

router.get("/orders", orderController.getAllOrders);
router.get("/orders/:id", orderController.getOrderById);
router.patch("/orders/status/:id", orderController.updateOrderStatus);
router.delete("/orders/:id", orderController.deleteOrder);

module.exports = router;
