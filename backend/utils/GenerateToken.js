// utils/GenerateToken.js
require("dotenv").config();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY;
const LOGIN_EXPIRE = process.env.LOGIN_TOKEN_EXPIRATION || "30d";
const RESET_EXPIRE = process.env.PASSWORD_RESET_TOKEN_EXPIRATION || "15m";

exports.generateToken = (userPayload, isReset = false) => {
  if (!JWT_SECRET) {
    throw new Error("JWT Secret missing (JWT_SECRET or SECRET_KEY is not set)");
  }

  return jwt.sign(
    {
      _id: userPayload._id,
      email: userPayload.email,
      name: userPayload.name || "",
    },
    JWT_SECRET,
    {
      expiresIn: isReset ? RESET_EXPIRE : LOGIN_EXPIRE,
    }
  );
};
