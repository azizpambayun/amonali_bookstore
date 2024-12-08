const { Book } = require("../models");

// endpoint to get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({
      error: "Failed to fetch books",
    });
  }
};

// endpoint to get book details using book_id
const getBookById = async (req, res) => {
  const bookId = req.params.book_id;
  try {
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({
        error: "Book not found",
      });
    }
    res.json(book);
  } catch (error) {
    console.error("Error fetching book details", error);
    res.status(500).json({
      error: "Failed to fetch book details",
    });
  }
};

// endpoint to create books
const createBook = async (req, res) => {
  const { title, author, publisher, year_published, synopsis, price, stock, image, category } = req.body;
  try {
    const newBook = await Book.create({
      title,
      author,
      publisher,
      year_published,
      synopsis,
      price,
      stock,
      image,
      category,
    });
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error creating new book:", error);
    res.status(500).json({
      error: "Failed to create new book",
    });
  }
};

const updateBook = async (req, res) => {
  const bookId = req.params.book_id;
  const { title, author, publisher, year_published, synopsis, price, stock, image, category } = req.body;

  try {
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    await book.update({
      title,
      author,
      publisher,
      year_published,
      synopsis,
      price,
      stock,
      image,
      category,
    });
    res.json(book);
  } catch (error) {
    console.error("Error updating book", error);
    res.status(500).json({
      error: "Failed to update book",
    });
  }
};

const deleteBook = async (req, res) => {
  const bookId = req.params.book_id;

  try {
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({
        error: "Book not found",
      });
    }
    // deleting book
    await book.destroy();
    res.json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting book", error);
    res.status(500).json({
      error: "Failed to delete book",
    });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
