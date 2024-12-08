const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// function for register
const registerUser = async (req, res) => {
  const { name, email, password, address, phone_number } = req.body;
  try {
    // hashing the password first
    const hashedPassword = await bcrypt.hash(password, 10);
    // creating new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      phone_number,
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
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY);
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
