const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transactionsController");
const { body } = require("express-validator");

router.post(
  "/",
  [
    body("user_id").isInt().withMessage("User ID must be an integer"),
    body("books").isArray().withMessage("Books must be an array"),
    body("books.*.book_id").isInt().withMessage("Book ID must be an integer"),
    body("books.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  ],
  transactionsController.createTransaction
);
router.get("/:transaction_id", transactionsController.getTransactionById);
router.put("/:transaction_id", transactionsController.updateTransactionStatus);

module.exports = router;
