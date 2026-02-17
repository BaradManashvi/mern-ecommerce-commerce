const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/Emails");
const { sanitizeUser } = require("../utils/SanitizeUser");
const { generateToken } = require("../utils/GenerateToken");
const PasswordResetToken = require("../models/PasswordResetToken");
const { Otp, generateOTP } = require("../models/OTP");

// // ===================== SIGNUP =====================
// exports.signup = async (req, res) => {
//   try {
//     const existingUser = await User.findOne({ email: req.body.email });

//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     req.body.password = hashedPassword;

//     const createdUser = new User(req.body);
//     await createdUser.save();

//     const secureInfo = sanitizeUser(createdUser);
//     const token = generateToken(secureInfo);

//     res.cookie("token", token, {
//       sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
//       maxAge:
//         Date.now() +
//         parseInt(process.env.COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000),
//       httpOnly: true,
//       secure: process.env.PRODUCTION === "true" ? true : false,
//     });

//     res.status(201).json(sanitizeUser(createdUser));
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ message: "Error occurred during signup, please try again later" });
//   }
// };

// // ===================== LOGIN =====================
// exports.login = async (req, res) => {
//   try {
//     const existingUser = await User.findOne({ email: req.body.email });

//     if (existingUser && (await bcrypt.compare(req.body.password, existingUser.password))) {
//       const secureInfo = sanitizeUser(existingUser);
//       const token = generateToken(secureInfo);

//       res.cookie("token", token, {
//         sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
//         maxAge:
//           Date.now() +
//           parseInt(process.env.COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000),
//         httpOnly: true,
//         secure: process.env.PRODUCTION === "true" ? true : false,
//       });

//       return res.status(200).json(sanitizeUser(existingUser));
//     }

//     res.clearCookie("token");
//     return res.status(404).json({ message: "Invalid Credentials" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Some error occurred while logging in" });
//   }
// };

// const { Otp, generateOTP } = require("../models/OTP");

// Helper: resolved JWT secret (support both names while you migrate)
const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY;
if (!JWT_SECRET) {
  console.warn("Warning: JWT secret not set (process.env.JWT_SECRET || process.env.SECRET_KEY)");
}

// cookie duration in ms
const cookieDays = parseInt(process.env.COOKIE_EXPIRATION_DAYS || "30", 10);
const cookieMaxAge = cookieDays * 24 * 60 * 60 * 1000;

// ===================== SIGNUP =====================
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = new User({ ...req.body, email: email.toLowerCase().trim(), password: hashedPassword });
    await createdUser.save();

    const secureInfo = sanitizeUser(createdUser);
    const token = generateToken(secureInfo);

    res.cookie("token", token, {
      sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
      maxAge: cookieMaxAge,
      httpOnly: true,
      secure: process.env.PRODUCTION === "true",
      // Optionally set domain/path if needed for cross-subdomain cookies
    });

    return res.status(201).json(sanitizeUser(createdUser));
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Error occurred during signup" });
  }
};

// ===================== LOGIN =====================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (!existingUser) {
      res.clearCookie("token");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      res.clearCookie("token");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const secureInfo = sanitizeUser(existingUser);
    const token = generateToken(secureInfo);

    res.cookie("token", token, {
      sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
      maxAge: cookieMaxAge,
      httpOnly: true,
      secure: process.env.PRODUCTION === "true",
    });

    return res.status(200).json(sanitizeUser(existingUser));
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Some error occurred while logging in" });
  }
};

// ===================== VERIFY OTP =====================
exports.verifyOtp = async (req, res) => {
  try {
    const isValidUserId = await User.findById(req.body.userId);

    if (!isValidUserId) {
      return res.status(404).json({ message: "User not found" });
    }

    const isOtpExisting = await Otp.findOne({ user: isValidUserId._id });
    if (!isOtpExisting) {
      return res.status(404).json({ message: "OTP not found" });
    }

    if (isOtpExisting.expiresAt < new Date()) {
      await Otp.findByIdAndDelete(isOtpExisting._id);
      return res.status(400).json({ message: "OTP has expired" });
    }

    const isValidOtp = await bcrypt.compare(req.body.otp, isOtpExisting.otp);
    if (isValidOtp) {
      await Otp.findByIdAndDelete(isOtpExisting._id);
      const verifiedUser = await User.findByIdAndUpdate(
        isValidUserId._id,
        { isVerified: true },
        { new: true }
      );

      if (!verifiedUser) {
        return res.status(404).json({ message: "User not found during OTP verification" });
      }

      return res.status(200).json(sanitizeUser(verifiedUser));
    }

    return res.status(400).json({ message: "OTP is invalid or expired" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occurred during OTP verification" });
  }
};

// ===================== RESEND OTP =====================
exports.resendOtp = async (req, res) => {
  try {
    const existingUser = await User.findById(req.body.user);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await Otp.deleteMany({ user: existingUser._id });

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const newOtp = new Otp({
      user: existingUser._id,
      otp: hashedOtp,
      expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
    });
    await newOtp.save();

    await sendMail(
      existingUser.email,
      "OTP Verification for Your Account",
      `Your One-Time Password (OTP) is: <b>${otp}</b>.<br/>Please do not share this OTP with anyone.`
    );

    res.status(201).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error occurred while resending OTP" });
  }
};

// ===================== FORGOT PASSWORD =====================
exports.forgotPassword = async (req, res) => {
  try {
    const isExistingUser = await User.findOne({ email: req.body.email });

    if (!isExistingUser) {
      return res.status(404).json({ message: "Provided email does not exist" });
    }

    await PasswordResetToken.deleteMany({ user: isExistingUser._id });

    const passwordResetToken = generateToken(sanitizeUser(isExistingUser), true);
    const hashedToken = await bcrypt.hash(passwordResetToken, 10);

    const newToken = new PasswordResetToken({
      user: isExistingUser._id,
      token: hashedToken,
      expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
    });
    await newToken.save();

    await sendMail(
      isExistingUser.email,
      "Password Reset Link",
      `<p>Hello ${isExistingUser.name || ""},</p>
       <p>Click below to reset your password:</p>
       <p><a href=${process.env.ORIGIN}/reset-password/${isExistingUser._id}/${passwordResetToken}>Reset Password</a></p>
       <p>This link will expire soon.</p>`
    );

    res
      .status(200)
      .json({ message: `Password reset link sent to ${isExistingUser.email}` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error occurred while sending reset link" });
  }
};

// ===================== RESET PASSWORD =====================
exports.resetPassword = async (req, res) => {
  try {
    const isExistingUser = await User.findById(req.body.userId);
    if (!isExistingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isResetTokenExisting = await PasswordResetToken.findOne({
      user: isExistingUser._id,
    });
    if (!isResetTokenExisting) {
      return res.status(404).json({ message: "Reset link is not valid" });
    }

    if (isResetTokenExisting.expiresAt < new Date()) {
      await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);
      return res.status(404).json({ message: "Reset link expired" });
    }

    if (
      isResetTokenExisting &&
      (await bcrypt.compare(req.body.token, isResetTokenExisting.token))
    ) {
      await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);
      await User.findByIdAndUpdate(isExistingUser._id, {
        password: await bcrypt.hash(req.body.password, 10),
      });

      return res.status(200).json({ message: "Password updated successfully" });
    }

    return res.status(404).json({ message: "Invalid or expired reset link" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error resetting password" });
  }
};

// ===================== LOGOUT =====================
exports.logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      maxAge: 0,
      sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
      httpOnly: true,
      secure: process.env.PRODUCTION === "true" ? true : false,
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
  }
};

// // ===================== CHECK AUTH =====================
// exports.checkAuth = async (req, res) => {
//   try {
//     const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded._id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const safeUser = sanitizeUser(user);
//     return res.status(200).json(safeUser);
//   } catch (error) {
//     console.error("Error in checkAuth:", error);
//     return res.status(500).json({ message: "Error checking auth", error: error.message });
//   }
// };


// ===================== CHECK AUTH =====================
exports.checkAuth = async (req, res) => {
  try {
    const token = req.cookies?.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(sanitizeUser(user));
  } catch (error) {
    console.error("Error in checkAuth:", error);
    if (error.name === "TokenExpiredError") return res.status(401).json({ message: "Token expired" });
    if (error.name === "JsonWebTokenError") return res.status(401).json({ message: "Invalid token" });
    return res.status(500).json({ message: "Error checking auth", error: error.message });
  }
};