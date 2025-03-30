require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const cartRowRoutes = require("./routes/cartRowRoutes");
const productRoutes = require("./routes/productRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");

// Serve static images correctly
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/carts", cartRoutes);
app.use("/cart_rows", cartRowRoutes);
app.use("/products", productRoutes);
app.use("/ratings", ratingRoutes);

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed: ", error);
  }
});
