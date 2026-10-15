const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    bio: {
      type: String,
      trim: true,
    },

    graduationYear: {
      type: Number,
    },

    branch: {
      type: String,
      trim: true,
    },

    college: {
      type: String,
      trim: true,
    },

    currentCompany: {
      type: String,
      trim: true,
    },

    currentRole: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    linkedin: {
      type: String,
      trim: true,
    },

    profilePicture: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", profileSchema);