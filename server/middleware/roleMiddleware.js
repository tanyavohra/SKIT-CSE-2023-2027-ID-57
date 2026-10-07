const User = require("../models/User");

const alumniOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "alumni") {
      return res.status(403).json({
        message: "Only alumni can perform this action",
      });
    }

    next();
  } catch (error) {
    console.error("Role authorization error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = alumniOnly;