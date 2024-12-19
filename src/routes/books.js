const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");
const { body } = require("express-validator");
const isAdmin = require("../middleware/isAdmin");
const authenticateUser = require("../middleware/authenticateUser");

router.get("/", booksController.getAllBooks);
router.get("/:book_id", booksController.getBookById);
router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("author").notEmpty().withMessage("Author is required"),
    body("publisher").notEmpty().withMessage("Publisher is required"),
    body("year_published").isInt().withMessage("Year published must be an integer"),
    body("synopsis").notEmpty().withMessage("Synopsis is required"),
    body("price").isFloat().withMessage("Price must be a number"),
    body("stock").isInt().withMessage("Stock must be an integer"),
    body("image").isURL().withMessage("Image must be a valid URL"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  authenticateUser,
  isAdmin,
  booksController.createBook
);
router.put("/:book_id", authenticateUser, isAdmin, booksController.updateBook);
router.delete("/:book_id", authenticateUser, isAdmin, booksController.deleteBook);
router.get("/search", booksController.searchBooks);

module.exports = router;
