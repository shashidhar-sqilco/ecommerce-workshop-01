const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middlewares/authMiddleware");
const connectTODb = require("./config/connectTODb");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({}));
app.use(cookieParser());

// Use async IIFE to set up routes after dynamic imports are resolved
(async () => {
  const userRouter = (await import("./controllers/UserController.js")).default;
  const productsRoutes = (await import("./controllers/ProductsController.js"))
    .default;
  const cartRouter = (await import("./controllers/CartController.js")).default;
  const orderRouter = (await import("./controllers/OrderController.js"))
    .default;

  app.use("/api/users", userRouter);
  app.use("/api/products", productsRoutes);
  app.use("/api/cart", authMiddleware, cartRouter);
  app.use("/api/order", authMiddleware, orderRouter);

  // Serve static files from the React build
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  // Handle any requests that don't match the API routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
  });

  const PORT = process.env.PORT || 8080;

  app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
      await connectTODb();
      console.log("Connected to database");
    } catch (error) {
      console.error("Failed to connect to database:", error);
    }
  });
})();
