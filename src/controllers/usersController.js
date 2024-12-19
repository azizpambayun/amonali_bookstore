const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { JSDOM } = require("jsdom");
const window = new JSDOM("").window;
const DOMPurify = require("dompurify")(window);

// function for register
const registerUser = async (req, res) => {
  // checking error validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { name, email, password, address, phone_number, role } = req.body;

  // sanitizing input using DOMPurify
  const sanitizeName = DOMPurify.sanitize(name);
  const sanitizeAddress = DOMPurify.sanitize(address);

  try {
    // hashing the password first
    const hashedPassword = await bcrypt.hash(password, 10);
    // creating new user
    const newUser = await User.create({
      name: sanitizeName,
      email,
      password: hashedPassword,
      address: sanitizeAddress,
      phone_number,
      role,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      error: "Failed to create user",
    });
  }
};

// function for login
const loginUser = async (req, res) => {
  // checking error validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;
  try {
    // searching the user's email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // comparing password input with the password in the db
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // creating Json Web Token
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET_KEY);
    res.json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({
      error: "Failed to log in",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
