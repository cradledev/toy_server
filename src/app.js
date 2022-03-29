const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fileUpload = require('express-fileupload')

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(fileUpload())

//Routes
app.use("/api/v1/users", require("./routes/user.routes"));
app.use("/api/v1/products", require("./routes/product.routes"));
app.use("/api/v1/orders", require("./routes/order.routes"));
app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/categories", require("./routes/category.routes"));

app.get("/", (req, res) => {
  res.json({
    msg: "Welcome a Toy-Commerce REST API",
  });
});
// Handle Error Requests
app.use((req, res, next) => {
  const error = new Error();
  error.message = 'Not Found';
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
      error: error
  });
});

module.exports = app;
