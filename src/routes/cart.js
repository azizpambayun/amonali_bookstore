const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/", cartController.addItem);
router.put("/:cart_item_id", cartController.updateItem);
router.delete("/:cart_item_id", cartController.deleteItem);

module.exports = router;
