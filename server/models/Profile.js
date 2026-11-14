
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Basic information
    phone: { type: String, trim: true },
    bio: { type: String, trim: true },
    college: { type: String, trim: true },
    branch: { type: String, trim: true },
    graduationYear: { type: Number },
    location: { type: String, trim: true },

    // Skills and interests
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },

    // Student-specific information
    experienceLevel: { type: String, trim: true },
    jobPreference: { type: String, trim: true },

    projects: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    resumeLink: { type: String, trim: true },
    cgpa: { type: Number },
    backlogs: { type: Number },

    certifications: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    achievements: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    extracurricularActivities: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    // Alumni-specific information
    currentCompany: { type: String, trim: true },
    currentRole: { type: String, trim: true },
    careerDomain: { type: String, trim: true },
    alumniType: { type: String, trim: true },

    menteesServed: { type: Number, default: 0 },

    isOpenToMentoring: {
      type: Boolean,
      default: false,
    },

    yearsOfExperience: { type: Number },

   higherEducation: {
    type: String,
    trim: true,
  },

    previousBranches: {
      type: [String],
      default: [],
    },

    foundedStartups: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    patents: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    publications: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    awards: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    // Social and profile information
    linkedin: { type: String, trim: true },
    profilePicture: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", profileSchema);
