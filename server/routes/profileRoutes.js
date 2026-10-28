const express = require("express");
const Profile = require("../models/Profile");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();


/* GET /api/profile/directory
   Browse and search alumni profiles
*/
router.get("/directory", authMiddleware, async (req, res) => {
  try {
    const search = (req.query.search || "").trim();

    // Prevent excessively long search queries
    if (search.length > 100) {
      return res.status(400).json({
        message: "Search query is too long",
      });
    }

    // Pagination
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 10)
    );

    // Escape special regex characters in user input
    const escapedSearch = search.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(escapedSearch, "i");

    // Find users whose role is alumni
    const alumniFilter = { role: "alumni" };

    // Match alumni by name when a search term is provided
    const matchingAlumni = search
      ? await User.find({
          ...alumniFilter,
          fullName: regex,
        }).select("_id")
      : [];

    // Get all alumni IDs for the directory
    const alumniUsers = await User.find(alumniFilter).select("_id");
    const alumniIds = alumniUsers.map((user) => user._id);

    const profileFilter = {
      userId: { $in: alumniIds },
    };

    if (search) {
      profileFilter.$or = [
        { userId: { $in: matchingAlumni.map((user) => user._id) } },
        { currentCompany: regex },
        { currentRole: regex },
        { location: regex },
        { branch: regex },
        { college: regex },
        { skills: regex },
      ];
    }

    const [profiles, total] = await Promise.all([
      Profile.find(profileFilter)
        .select(
          "userId bio graduationYear branch college currentCompany currentRole location skills linkedin profilePicture"
        )
        .populate("userId", "fullName")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Profile.countDocuments(profileFilter),
    ]);

    return res.status(200).json({
      message: "Alumni directory fetched successfully",
      alumni: profiles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Alumni directory error:", error.message);

    return res.status(500).json({
      message: "Server error while fetching alumni directory",
    });
  }
});


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