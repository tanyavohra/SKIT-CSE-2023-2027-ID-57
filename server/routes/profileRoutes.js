const express = require("express");
const Profile = require("../models/Profile");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get current user's profile
router.get("/", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.userId });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.status(200).json({
      profile,
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// Create or update current user's profile
router.put("/", authMiddleware, async (req, res) => {
  try {
    const {
      phone,
      bio,
      graduationYear,
      branch,
      college,
      currentCompany,
      currentRole,
      location,
      skills,
      linkedin,
      profilePicture,
    } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      {
        userId: req.userId,
        phone,
        bio,
        graduationYear,
        branch,
        college,
        currentCompany,
        currentRole,
        location,
        skills,
        linkedin,
        profilePicture,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update profile error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;