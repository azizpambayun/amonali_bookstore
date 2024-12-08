const { CartItem, Book } = require("../models");
const cartitem = require("../models/cartitem");

const addItem = async (req, res) => {
  const { user_id, book_id, quantity } = req.body;
  try {
    // checking up the availability of books
    const book = await Book.findByPk(book_id);
    if (!book) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    // checking up the stocks
    if (book.stock < quantity) {
      return res.status(400).json({
        error: "Insufficient Stock",
      });
    }

    // searching cart item that already exist
    let cartItem = await CartItem.findOne({
      where: { user_id, book_id },
    });

    if (cartItem) {
      // updating if the cart item is exist
      const newQuantity = cartItem.quantity + quantity;
      await cartItem.update({ quantity: newQuantity });
    } else {
      // if not exist create the new one
      cartItem = await CartItem.create({
        user_id,
        book_id,
        quantity,
      });
    }
    res.status(201).json(cartItem);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({
      error: "Failed to add item to cart",
    });
  }
};

const updateItem = async (req, res) => {
  const cartItemId = req.params.cart_item_id;
  const { quantity } = req.body;

  try {
    const cartItem = await CartItem.findByPk(cartItemId);

    if (!cartItem) {
      return res.status(404).json({
        error: "Cart item not found",
      });
    }

    // quantity validation
    if (quantity <= 0) {
      return res.status(400).json({
        error: "Quantity must be greater that 0",
      });
    }

    // checking the stock
    const book = await Book.findByPk(cartItem.book_id);
    if (book.stock < quantity) {
      return res.status(400).json({
        error: "Insufficient stock",
      });
    }

    await cartItem.update({ quantity });
    res.json(cartItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({
      error: "Failed to update cart item",
    });
  }
};

const deleteItem = async (req, res) => {
  const cartItemId = await req.params.cart_item_id;

  try {
    const cartItem = await CartItem.findByPk(cartItemId);

    if (!cartItem) {
      return res.status(404).json({
        error: "Cart item not found",
      });
    }

    await cartItem.destroy();
    res.json({ message: "Cart Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({
      error: "Failed to delete cart item",
    });
  }
};

module.exports = {
  addItem,
  updateItem,
  deleteItem,
};
