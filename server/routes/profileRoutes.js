const express = require("express");
const mongoose = require("mongoose");
const Profile = require("../models/Profile");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();


/* ------------------------------ Search helpers ------------------------------ */

const MAX_FILTER_LENGTH = 100;
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const toRegex = (value) => new RegExp(escapeRegex(value), "i");
const readParam = (value) => (typeof value === "string" ? value.trim() : "");

/* GET /api/profile/directory
   Search people by name and narrow them down like LinkedIn.

   Query params (all optional):
     search     free text: name, company, role, city, branch, college, skills
     education  matches college or branch
     company    matches current company
     city       matches location
     role       alumni (default) | student | all
     page, limit
*/
router.get("/directory", authMiddleware, async (req, res) => {
  try {
    const search = readParam(req.query.search);
    const education = readParam(req.query.education);
    const company = readParam(req.query.company);
    const city = readParam(req.query.city);
    const role = ["alumni", "student", "all"].includes(req.query.role)
      ? req.query.role
      : "alumni";

    // Prevent excessively long search queries
    if ([search, education, company, city].some((v) => v.length > MAX_FILTER_LENGTH)) {
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

    // Who can appear in the results (never the person searching)
    const userFilter = { _id: { $ne: req.userId } };
    if (role !== "all") userFilter.role = role;

    const users = await User.find(userFilter).select("_id");
    const conditions = [{ userId: { $in: users.map((user) => user._id) } }];

    // Free-text search: name (on the User) or any searchable profile field
    if (search) {
      const regex = toRegex(search);
      const matchingByName = await User.find({
        ...userFilter,
        fullName: regex,
      }).select("_id");

      conditions.push({
        $or: [
          { userId: { $in: matchingByName.map((user) => user._id) } },
          { currentCompany: regex },
          { currentRole: regex },
          { location: regex },
          { branch: regex },
          { college: regex },
          { skills: regex },
        ],
      });
    }

    // Filters (each one narrows the results further)
    if (education) {
      const regex = toRegex(education);
      conditions.push({ $or: [{ college: regex }, { branch: regex }] });
    }
    if (company) conditions.push({ currentCompany: toRegex(company) });
    if (city) conditions.push({ location: toRegex(city) });

    const profileFilter = { $and: conditions };

    const [profiles, total] = await Promise.all([
      Profile.find(profileFilter)  
.select(
  "userId bio graduationYear branch college currentCompany currentRole location skills interests careerDomain alumniType isOpenToMentoring yearsOfExperience linkedin profilePicture"
)

        .populate("userId", "fullName role")
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

/* GET /api/profile/user/:id
   Another person's public profile -> { user: { id, fullName, role }, profile }
*/
router.get("/user/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const user = await User.findById(req.params.id).select("fullName role");
    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const profile = await Profile.findOne({ userId: user._id })
      .select("-phone")
      .lean();

    return res.status(200).json({
      user: { id: user._id, fullName: user.fullName, role: user.role },
      profile: profile || {},
    });
  } catch (error) {
    console.error("Get user profile error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});



// Get current user's profile and account information
router.get("/", authMiddleware, async (req, res) => {
  try {
    const [user, profile] = await Promise.all([
      User.findById(req.userId).select("fullName email role"),
      Profile.findOne({ userId: req.userId }),
    ]);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
      profile: profile || {},
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
});


// Create or update current user's profile

// Create or update current user's profile
router.put("/", authMiddleware, async (req, res) => {
  try {
    const {
      fullName,
      phone,
      bio,
      graduationYear,
      branch,
      college,
      currentCompany,
      currentRole,
      location,
      skills,
      interests,
      linkedin,
      profilePicture,
      experienceLevel,
      jobPreference,
      projects,
      resumeLink,
      cgpa,
      backlogs,
      certifications,
      achievements,
      extracurricularActivities,
      careerDomain,
      alumniType,
      menteesServed,
      isOpenToMentoring,
      yearsOfExperience,
      higherEducation,
      previousBranches,
      foundedStartups,
      patents,
      publications,
      awards,
    } = req.body;

    // Validate updated account name
    if (
      Object.prototype.hasOwnProperty.call(req.body, "fullName") &&
      (typeof fullName !== "string" || !fullName.trim())
    ) {
      return res.status(400).json({
        message: "Full name cannot be empty",
      });
    }

    
    const allowedFields = [
      "phone",
      "bio",
      "graduationYear",
      "branch",
      "college",
      "currentCompany",
      "currentRole",
      "location",
      "skills",
      "interests",
      "linkedin",
      "profilePicture",
      "experienceLevel",
      "jobPreference",
      "projects",
      "resumeLink",
      "cgpa",
      "backlogs",
      "certifications",
      "achievements",
      "extracurricularActivities",
      "careerDomain",
      "alumniType",
      "menteesServed",
      "isOpenToMentoring",
      "yearsOfExperience",
      "higherEducation",
      "previousBranches",
      "foundedStartups",
      "patents",
      "publications",
      "awards",
    ];

    const profileUpdates = {};

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        profileUpdates[field] = req.body[field];
      }
    });

    // Save profile information
    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      {
        $set: {
          ...profileUpdates,
          userId: req.userId,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    // Update account name in User collection
    let user;

    if (Object.prototype.hasOwnProperty.call(req.body, "fullName")) {
      user = await User.findByIdAndUpdate(
        req.userId,
        {
          $set: {
            fullName: fullName.trim(),
          },
        },
        {
          new: true,
          runValidators: true,
        }
      ).select("fullName email role");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
    } else {
      user = await User.findById(req.userId).select(
        "fullName email role"
      );
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(
      error.name === "ValidationError" || error.name === "CastError"
        ? 400
        : 500
    ).json({
      message:
        error.name === "ValidationError" || error.name === "CastError"
          ? error.message
          : "Server error while updating profile",
    });
  }
});


module.exports = router;
