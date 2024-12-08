const { Transaction, TransactionDetail, Book, sequelize, User } = require("../models");

const createTransaction = async (req, res) => {
  const { user_id, books } = req.body;

  try {
    // Starting data transaction
    const transaction = await sequelize.transaction();
    try {
      // creating new transaction
      const newTransaction = await Transaction.create(
        {
          user_id,
          date: new Date(),
          total_price: 0,
          status: "pending",
        },
        { transaction }
      );

      let totalPrice = 0;

      // Looping list of books
      for (const bookItem of books) {
        const { book_id, quantity } = bookItem;

        // search by Id
        const book = await Book.findByPk(book_id, { transaction });
        if (!book) {
          throw new Error(`Book with ID ${book_id} not found`);
        }

        // substract the book stock
        if (book.stock < quantity) {
          throw new Error(`Insufficient stock for book with id ${book_id}`);
        }
        await book.update({ stock: book.stock - quantity }, { transaction });

        // counting total price
        const bookPrice = book.price * quantity;
        totalPrice += bookPrice;

        // creating transaction detail
        await TransactionDetail.create(
          {
            transaction_id: newTransaction.id,
            book_id,
            quantity,
            unit_price: book.price,
          },
          { transaction }
        );
      }

      // updating total price transaction
      await newTransaction.update({ total_price: totalPrice }, { transaction });

      // commit database transaction
      await transaction.commit();

      res.status(201).json(newTransaction);
    } catch (error) {
      // Rollback if error happens
      await transaction.rollback();
      console.error("Error creating transaction", error);
      res.status(500).json({
        error: "Failed to create transaction",
      });
    }
  } catch (error) {
    console.error("Error creating transaction", error);
    res.status(500).json({
      error: "Failed to create transaction",
    });
  }
};

const getTransactionById = async (req, res) => {
  const transactionId = req.params.transaction_id;

  try {
    // 1. Ambil data transaksi
    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // 2. Ambil detail transaksi
    const transactionDetails = await TransactionDetail.findAll({
      where: { transaction_id: transactionId },
    });

    // 3. Ambil data buku untuk setiap detail transaksi
    const bookIds = transactionDetails.map((detail) => detail.book_id);
    const books = await Book.findAll({
      where: { id: bookIds },
    });

    // 4. Format data buku agar mudah diakses
    const booksById = books.reduce((acc, book) => {
      acc[book.id] = book;
      return acc;
    }, {});

    // 5. Gabungkan data transaksi, detail transaksi, dan buku
    const transactionData = {
      ...transaction.toJSON(),
      details: transactionDetails.map((detail) => ({
        ...detail.toJSON(),
        book: booksById[detail.book_id],
      })),
    };

    res.json(transactionData);
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    res.status(500).json({ error: "Failed to fetch transaction details" });
  }
};

const updateTransactionStatus = async (req, res) => {
  const transactionId = req.params.transaction_id;
  const { status } = req.body;

  try {
    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
      return res.status(404).json({
        error: "Transaction not found",
      });
    }

    // validation status
    const validStatuses = ["pending", "processed", "shipped", "completed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid transaction status",
      });
    }

    // updating transaction status
    await transaction.update({ status });
    res.json(transaction);
  } catch (error) {
    console.error("Error updating transaction status:", error);
    res.status(500).json({
      error: "Failed to updating transaction status",
    });
  }
};

module.exports = {
  createTransaction,
  getTransactionById,
  updateTransactionStatus,
};
