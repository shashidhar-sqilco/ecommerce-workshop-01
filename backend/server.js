const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectTODb = require("./config/connectTODb");
const userRouter = require("./controllers/UserController");
const productsRoutes = require("./controllers/ProductsController");
const cookieParser=require('cookie-parser');

dotenv.config();

const app = express();
app.use(express.json());

//package to allow cross-origin reqs
app.use(cors({}));

//package to use cookies
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/products", productsRoutes);


app.listen(8080, () => {
  console.log("server is running on port 8080");
  connectTODb();
});
