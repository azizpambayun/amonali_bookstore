const isAdmin = (req, res, next) => {
  const userRole = req.user.role;

  if (userRole === "admin") {
    next();
  } else {
    console.log(req.user);
    console.log(req.user.role);
    return res.status(403).json({
      error: "Forbidden",
    });
  }
};

module.exports = isAdmin;
