const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middlewares/authMiddleware");

dotenv.config();

// Use dynamic imports for modules that might have path issues
const connectTODb = import("./config/connectTODb.js").then(
  (module) => module.default
);
const userRouter = import("./controllers/UserController.js").then(
  (module) => module.default
);
const productsRoutes = import("./controllers/ProductsController.js").then(
  (module) => module.default
);
const cartRouter = import("./controllers/CartController.js").then(
  (module) => module.default
);
const orderRouter = import("./controllers/OrderController.js").then(
  (module) => module.default
);

const app = express();

app.use(express.json());
app.use(cors({}));
app.use(cookieParser());

// Use async IIFE to set up routes after dynamic imports are resolved
(async () => {
  app.use("/api/users", await userRouter);
  app.use("/api/products", await productsRoutes);
  app.use("/api/cart", authMiddleware, await cartRouter);
  app.use("/api/order", authMiddleware, await orderRouter);

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
      const db = await connectTODb;
      await db();
      console.log("Connected to database");
    } catch (error) {
      console.error("Failed to connect to database:", error);
    }
  });
})();
