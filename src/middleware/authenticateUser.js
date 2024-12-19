const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // checking if there is token on authorization header
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    // verifying JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // saving user data on req.user
    req.user = { userId: decoded.userId, role: decoded.role };

    next(); //on to the next middleware or the other controller
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      error: "Invalid tokern",
    });
  }
};

module.exports = authenticateUser;
