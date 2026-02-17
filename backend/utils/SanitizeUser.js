// backend/utils/SanitizeUser.js
exports.sanitizeUser = (user) => {
  if (!user) {
    console.error("sanitizeUser: user is null or undefined");
    return null;
  }

  return {
    _id: user._id,
    name: user.name,       // <-- add this
    email: user.email,
    isVerified: user.isVerified,
    isAdmin: user.isAdmin,
  };
};
