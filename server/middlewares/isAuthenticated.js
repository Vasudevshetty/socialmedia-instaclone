const jwt = require("jsonwebtoken");

async function isAuthenticated(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });

    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode)
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });

    req.id = decode.userId;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

module.exports = isAuthenticated;
