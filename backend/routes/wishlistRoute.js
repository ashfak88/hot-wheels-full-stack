const express = require("express");
const { authMiddleware } = require("../middlware/authMiddleware");
const wishlistController = require("../controllers/wishlistController");

const router = express.Router();

router.get("/:userId", authMiddleware, wishlistController.getWishlist);
router.post("/add", authMiddleware, wishlistController.addToWishlist);
router.delete("/:userId/:productId", authMiddleware, wishlistController.removeFromWishlist);

module.exports = router;
