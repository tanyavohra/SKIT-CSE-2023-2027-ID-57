const express = require("express");
const Job = require("../models/Job");
const authMiddleware = require("../middleware/authMiddleware");
const alumniOnly = require("../middleware/roleMiddleware");

const router = express.Router();

// Create a new job opportunity
router.post("/", authMiddleware, alumniOnly, async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      location,
      jobType,
      skills,
      applicationLink,
    } = req.body;

    const job = await Job.create({
      postedBy: req.userId,
      title,
      company,
      description,
      location,
      jobType,
      skills,
      applicationLink,
    });

    res.status(201).json({
      message: "Job opportunity created successfully",
      job,
    });
  } catch (error) {
    console.error("Create job error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// Get all job opportunities
router.get("/", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("postedBy", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;