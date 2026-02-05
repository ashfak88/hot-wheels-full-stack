const Cart = require("../models/cartSchema");
const User = require("../models/userSchema");

const getCart = async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: "Forbidden Access" });
    }

    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.product");

    if (!cart) return res.json([]);

    res.json(cart.items || []);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
};

const updateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: "Forbidden Access" });
    }

    // Fetch user to get the name
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        userName: user.name,
        items: cartItems
      });
    } else {
      cart.items = cartItems;
      cart.userName = user.name; // Update in case user changed their name
    }

    await cart.save();

    res.json(cart.items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update cart" });
  }
}

module.exports = {
  getCart,
  updateCart,
}
