const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const { body } = require("express-validator");

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    body("address").notEmpty().withMessage("Address is required"),
    body("phone_number").isMobilePhone().withMessage("Invalid phone number"),
  ],
  usersController.registerUser
);
router.post("/login", [body("email").isEmail().withMessage("Invalid email address"), body("password").notEmpty().withMessage("Password is required")], usersController.loginUser);

module.exports = router;
