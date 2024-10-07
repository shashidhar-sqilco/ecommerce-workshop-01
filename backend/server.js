
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectTODb = require("./config/connectTODb");

dotenv.config();

const app = express();

app.use(cors({}));

app.get("/first", (req, res) => {
  res.send("Hello from the backend");
});

app.listen(8080, () => {
  console.log("server is running on port 8080");
  connectTODb();
});
