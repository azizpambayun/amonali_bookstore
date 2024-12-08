const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");

router.get("/", booksController.getAllBooks);
router.get("/:book_id", booksController.getBookById);
router.post("/", booksController.createBook);
router.put("/:book_id", booksController.updateBook);
router.delete("/:book_id", booksController.deleteBook);

module.exports = router;
