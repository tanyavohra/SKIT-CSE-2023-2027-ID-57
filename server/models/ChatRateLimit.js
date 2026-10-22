const mongoose = require("mongoose");

const chatRateLimitSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    windowStart: { type: Date, required: true },
    count: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  { versionKey: false }
);

chatRateLimitSchema.index({ userId: 1, windowStart: 1 }, { unique: true });
chatRateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("ChatRateLimit", chatRateLimitSchema);
