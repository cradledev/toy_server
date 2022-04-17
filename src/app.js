const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fileUpload = require('express-fileupload')

const app = express();

//Middlewares
app.use(cors());
// Setup CORS
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//     return res.status(200).json({});
//   }
//   next();
// });

app.use(express.json());
app.use("/", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(fileUpload())

//Routes
app.use("/api/v1/users", require("./routes/user.routes"));
app.use("/api/v1/products", require("./routes/product.routes"));
app.use("/api/v1/orders", require("./routes/order.routes"));
app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/categories", require("./routes/category.routes"));
app.use("/api/v1/config", require("./routes/config.routes"));
app.use("/api/v1/discount", require("./routes/discount.route"))
app.use("/api/v1/wishlist", require("./routes/wishlist.route"))

app.get("/", (req, res) => {
  res.json({
    msg: "Welcome a Toy-Commerce REST API",
  });
});
// try {
//   res.sendFile(__dirname + "/client/public/index.html");
// } catch (error) {
//   next();
// }
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
