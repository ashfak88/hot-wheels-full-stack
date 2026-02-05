const User = require("../models/userSchema");
const Product = require("../models/productSchema");

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        const users = await User.find({}, { orders: 1 });
        const allOrders = users.reduce((acc, user) => acc.concat(user.orders || []), []);

        const totalOrders = allOrders.length;
        const totalRevenue = allOrders.reduce((sum, order) => {
            return order.status !== "Cancelled" ? sum + (order.totalAmount || 0) : sum;
        }, 0);

        const statusCounts = allOrders.reduce((acc, order) => {
            const status = order.status || "Pending";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const salesData = [];
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split("T")[0];

            const dailyRevenue = allOrders
                .filter(o => o.createdAt && new Date(o.createdAt).toISOString().split("T")[0] === dateString && o.status !== "Cancelled")
                .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

            salesData.push({ date: dateString, sales: dailyRevenue });
        }
        salesData.reverse();

        const usersVsOrdersData = [];
        for (let i = 0; i < 12; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const month = date.getMonth();
            const year = date.getFullYear();
            const monthName = date.toLocaleString('default', { month: 'short' });

            const monthOrders = allOrders.filter(o => {
                const oDate = new Date(o.createdAt);
                return oDate.getMonth() === month && oDate.getFullYear() === year;
            }).length;

            const monthUsers = await User.countDocuments({
                createdAt: {
                    $gte: new Date(year, month, 1),
                    $lt: new Date(year, month + 1, 1)
                }
            });

            usersVsOrdersData.push({
                month: `${monthName} ${year}`,
                orders: monthOrders,
                users: monthUsers
            });
        }
        usersVsOrdersData.reverse();

        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            statusCounts,
            salesData,
            usersVsOrdersData
        });
    } catch (err) {
        console.error("Get stats error:", err);
        res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;

        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const totalUsers = await User.countDocuments(query);
        const users = await User.find(query)
            .select("-password -refreshTokens")
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            users,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: parseInt(page),
            totalUsers
        });
    } catch (err) {
        console.error("Fetch users error:", err);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers
};
