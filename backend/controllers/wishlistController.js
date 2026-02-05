const User = require("../models/userSchema");

const getWishlist = async (req, res) => {
    if (req.user.id !== req.params.userId) return res.status(403).json({ message: "Forbidden" });

    try {
        const user = await User.findById(req.user.id)
            .populate("wishlist.product");
        res.json(user.wishlist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch wishlist" });
    }
};

const addToWishlist = async (req, res) => {
    const { userId, productId } = req.body;
    if (req.user.id !== userId) return res.status(403).json({ message: "Forbidden" });

    try {
        const user = await User.findById(req.user.id);

        const exists = user.wishlist.find(
            (i) => i.product.toString() === productId
        );

        if (!exists) {
            user.wishlist.push({ product: productId });
        }

        await user.save();
        res.json(user.wishlist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add to wishlist" });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        if (req.user.id !== req.params.userId) return res.status(403).json({ message: "Forbidden" });

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { wishlist: { product: req.params.productId } } },
            { new: true }
        )

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user.wishlist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to remove from wishlist" });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist
};
