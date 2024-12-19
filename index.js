require("dotenv").config();
const express = require("express");
const db = require("./src/config/database");
const bookRoutes = require("./src/routes/books");
const userRoutes = require("./src/routes/users");
const transactionRoutes = require("./src/routes/transaction");
const cartRoutes = require("./src/routes/cart");
const helmet = require("helmet");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to process json file
app.use(express.json());
// Middleware to set security HTTP headers
app.use(helmet());

// get the routes
app.use("/books", bookRoutes);
app.use("/users", userRoutes);
app.use("/transactions", transactionRoutes);
app.use("/cart", cartRoutes);

// running the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
