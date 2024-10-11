const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectTODb = require("./config/connectTODb");
const userRouter = require("./controllers/UserController");
const productsRoutes = require("./controllers/ProductsController");
const cartRouter = require("./controllers/CartController");
const orderRouter = require("./controllers/OrderController");

const cookieParser = require("cookie-parser");
const authMiddleware = require("./middlewares/authMiddleware");

dotenv.config();

const app = express();
app.use(express.json());

//package to allow cross-origin reqs
app.use(cors({}));

//package to use cookies
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/products", productsRoutes);

//access controll
app.use("/api/cart", authMiddleware, cartRouter);
app.use("/api/order", authMiddleware, orderRouter);

// Serve static files from the React build
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Handle any requests that don't match the API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

app.listen(8080, () => {
  console.log("server is running on port 8080");
  connectTODb();
});
