const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const fs = require("fs");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({}));
app.use(cookieParser());

// Debugging: Log environment information
console.log("Node version:", process.version);
console.log("Current working directory:", process.cwd());
console.log("__dirname:", __dirname);
console.log("Environment variables:", Object.keys(process.env));

// Use absolute paths
const baseDir = __dirname;
const configPath = path.join(baseDir, "config", "DbConnect.js");
const authMiddlewarePath = path.join(
  baseDir,
  "middlewares",
  "authMiddleware.js"
);
const userControllerPath = path.join(
  baseDir,
  "controllers",
  "UserController.js"
);
const productsControllerPath = path.join(
  baseDir,
  "controllers",
  "ProductsController.js"
);
const cartControllerPath = path.join(
  baseDir,
  "controllers",
  "CartController.js"
);
const orderControllerPath = path.join(
  baseDir,
  "controllers",
  "OrderController.js"
);

// Attempt to require modules and log results
const tryRequire = (modulePath) => {
  try {
    const module = require(modulePath);
    console.log(`Successfully required: ${modulePath}`);
    return module;
  } catch (error) {
    console.error(`Error requiring ${modulePath}:`, error.message);
    return null;
  }
};

const connectTODb = tryRequire(configPath);
const authMiddleware = tryRequire(authMiddlewarePath);
const userRouter = tryRequire(userControllerPath);
const productsRoutes = tryRequire(productsControllerPath);
const cartRouter = tryRequire(cartControllerPath);
const orderRouter = tryRequire(orderControllerPath);

// Set up routes if modules were successfully loaded
if (userRouter) app.use("/api/users", userRouter);
if (productsRoutes) app.use("/api/products", productsRoutes);
if (cartRouter) app.use("/api/cart", authMiddleware, cartRouter);
if (orderRouter) app.use("/api/order", authMiddleware, orderRouter);

// Serve static files from the React build
const frontendBuildPath = path.join(baseDir, "..", "frontend", "build");
console.log("Frontend build path:", frontendBuildPath);
console.log("Frontend build exists:", fs.existsSync(frontendBuildPath));

if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
} else {
  console.warn("Frontend build directory not found");
}

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  if (connectTODb) {
    try {
      await connectTODb();
      console.log("Connected to database");
    } catch (error) {
      console.error("Failed to connect to database:", error);
    }
  }
});
