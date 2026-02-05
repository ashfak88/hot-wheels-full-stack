const express = require("express")
const { authMiddleware } = require("../middlware/authMiddleware")
const cartController = require("../controllers/cartController")

const router = express.Router()

router.get("/:userId", authMiddleware, cartController.getCart)
router.put("/:userId", authMiddleware, cartController.updateCart)

module.exports = router