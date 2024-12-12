const { Book } = require("../models");
const { Client } = require("@elastic/elasticsearch");

// elasticsearch configuration
const elasticsearchClient = new Client({
  node: "http://localhost:9200",
});

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

// endpoint to update books
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

// endpoint to delete books
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

// endpoint to search books
const searchBooks = async (req, res) => {
  const { q, author, category } = req.query;

  try {
    const mustQueries = [];

    if (q) {
      mustQueries.push({
        multi_match: {
          query: q,
          fields: ["title", "author", "synopsis"], // looking for the title, author and synopsis
          fuzziness: "AUTO", // Tolerating with mistype
        },
      });
    }

    if (author) {
      mustQueries.push({ match: { author } });
    }

    if (category) {
      mustQueries.push({ term: { category } });
    }

    const result = await elasticsearchClient.search({
      index: "books",
      body: {
        query: {
          bool: {
            must: mustQueries,
          },
        },
      },
    });

    const books = result.body.hits.hits.map((hit) => hit._source);

    res.json(books);
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ error: "Failed to search books" });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
};
