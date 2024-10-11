const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const fs = require("fs");

const connectTODb = require("./config/connectTODb");
const authMiddleware = require("./middlewares/authMiddleware");
const userRouter = require("./controllers/UserController");
const productsRoutes = require("./controllers/ProductsController");
const cartRouter = require("./controllers/CartController");
const orderRouter = require("./controllers/OrderController");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({}));
app.use(cookieParser());

// Debugging: Log current directory and its contents
console.log("Current directory:", __dirname);
fs.readdir(__dirname, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
  } else {
    console.log("Directory contents:", files);
  }
});

// Use absolute paths
const configPath = path.join(__dirname, "config", "connectTODb.js");
const userControllerPath = path.join(
  __dirname,
  "controllers",
  "UserController.js"
);
const productsControllerPath = path.join(
  __dirname,
  "controllers",
  "ProductsController.js"
);
const cartControllerPath = path.join(
  __dirname,
  "controllers",
  "CartController.js"
);
const orderControllerPath = path.join(
  __dirname,
  "controllers",
  "OrderController.js"
);
const authMiddlewarePath = path.join(
  __dirname,
  "middlewares",
  "authMiddleware.js"
);

// Debugging: Check if files exist
console.log("Config file exists:", fs.existsSync(configPath));
console.log("User controller exists:", fs.existsSync(userControllerPath));
console.log(
  "Products controller exists:",
  fs.existsSync(productsControllerPath)
);
console.log("Cart controller exists:", fs.existsSync(cartControllerPath));
console.log("Order controller exists:", fs.existsSync(orderControllerPath));
console.log("Auth middleware exists:", fs.existsSync(authMiddlewarePath));

app.use("/api/users", userRouter);
app.use("/api/products", productsRoutes);
app.use("/api/cart", authMiddleware, cartRouter);
app.use("/api/order", authMiddleware, orderRouter);

// Serve static files from the React build
const frontendBuildPath = path.join(__dirname, "..", "frontend", "build");
console.log("Frontend build path:", frontendBuildPath);
console.log("Frontend build exists:", fs.existsSync(frontendBuildPath));

app.use(express.static(frontendBuildPath));

// Handle any requests that don't match the API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
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
