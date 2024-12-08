const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transactionsController");

router.post("/", transactionsController.createTransaction);
router.get("/:transaction_id", transactionsController.getTransactionById);
router.put("/:transaction_id", transactionsController.updateTransactionStatus);

module.exports = router;
