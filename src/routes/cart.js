const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authenticateUser = require("../middleware/authenticateUser");

router.post("/", cartController.addItem);
router.put("/:cart_item_id", cartController.updateItem);
router.delete("/:cart_item_id", cartController.deleteItem);
router.get("/", authenticateUser, cartController.getCartItems);

module.exports = router;
