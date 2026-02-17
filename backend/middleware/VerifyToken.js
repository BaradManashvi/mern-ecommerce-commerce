require("dotenv").config();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Please login first" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info to request

    next(); // go ahead
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, login again" });
    }
    return res.status(401).json({ message: "Invalid token, login again" });
  }
};

exports.verifyToken = verifyToken;
