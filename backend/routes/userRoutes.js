const express = require("express");
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middlware/authMiddleware");
const { adminMiddleware } = require("../middlware/adminMiddleware");
const { validateRequest } = require("../middlware/validationMiddleware");
const { registerSchema, loginSchema } = require("../validation/userValidation");

const router = express.Router();

router.post("/register", validateRequest(registerSchema), userController.register);
router.post("/login", validateRequest(loginSchema), userController.login);
router.post("/refresh", userController.refresh);
router.post("/logout", userController.logout);
router.get("/profile", authMiddleware, userController.getProfile);

// Admin Routes
router.get("/", authMiddleware, adminMiddleware, userController.getAllUsers);
router.patch("/:userId", authMiddleware, adminMiddleware, userController.updateUser);
router.delete("/:userId", authMiddleware, adminMiddleware, userController.deleteUser);
router.get("/detail/:userId", authMiddleware, adminMiddleware, userController.getUserById);

module.exports = router;
