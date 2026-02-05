const express = require("express")
const productController = require("../controllers/productController")
const { authMiddleware } = require("../middlware/authMiddleware")
const { adminMiddleware } = require("../middlware/adminMiddleware")

const router = express.Router()

router.get("/", productController.getAllProducts)
router.patch("/:productId/restore", productController.restoreStock)

// Admin Routes
router.post("/", authMiddleware, adminMiddleware, productController.addProduct)
router.put("/:productId", authMiddleware, adminMiddleware, productController.updateProduct)
router.delete("/:productId", authMiddleware, adminMiddleware, productController.deleteProduct)

module.exports = router
