const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"], credentials: true }));
app.use(express.json());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/cart", require("./routes/cartRoute"));
app.use("/api/wishlist", require("./routes/wishlistRoute"));
app.use("/api/orders", require("./routes/orderRouter"));
app.use("/api/products", require("./routes/productRoute"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  res.send("Hot Wheels API running");
});

app.listen(5000, () => console.log("Server started on 5000"));
