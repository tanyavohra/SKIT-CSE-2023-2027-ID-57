const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const Message = require("../models/Message");

const router = express.Router();

// Inbox: one row per person you've chatted with, newest first
router.get("/conversations", authMiddleware, async (req, res) => {
  try {
    const me = new mongoose.Types.ObjectId(req.userId);
    const conversations = await Message.aggregate([
      { $match: { $or: [{ sender: me }, { recipient: me }] } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: { $cond: [{ $eq: ["$sender", me] }, "$recipient", "$sender"] },
          lastMessage: { $first: "$$ROOT" },
          unread: {
            $sum: {
              $cond: [{ $and: [{ $eq: ["$recipient", me] }, { $eq: ["$readAt", null] }] }, 1, 0],
            },
          },
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
      { $limit: 50 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          user: { _id: 1, fullName: 1, role: 1 },
          lastMessage: { text: 1, createdAt: 1, sender: 1 },
          unread: 1,
        },
      },
    ]);
    res.json({ conversations });
  } catch (err) {
    res.status(500).json({ message: "Could not load conversations" });
  }
});

// History with one person (also marks their messages to you as read)
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const limit = Math.min(parseInt(req.query.limit, 10) || 30, 100);
    const filter = {
      $or: [
        { sender: req.userId, recipient: userId },
        { sender: userId, recipient: req.userId },
      ],
    };
    if (req.query.before) filter.createdAt = { $lt: new Date(req.query.before) };

    const messages = await Message.find(filter).sort({ createdAt: -1 }).limit(limit);
    await Message.updateMany(
      { sender: userId, recipient: req.userId, readAt: null },
      { readAt: new Date() }
    );
    res.json({ messages: messages.reverse() });
  } catch (err) {
    res.status(500).json({ message: "Could not load messages" });
  }
});

module.exports = router;