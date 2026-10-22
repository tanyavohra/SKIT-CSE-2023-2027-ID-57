const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const ChatRateLimit = require("../models/ChatRateLimit");

const router = express.Router();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;
const MAX_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 1200;

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > MAX_MESSAGES) {
    return "Send between 1 and 8 recent messages.";
  }

  for (const message of messages) {
    if (
      !message ||
      !["user", "assistant"].includes(message.role) ||
      typeof message.content !== "string" ||
      !message.content.trim() ||
      message.content.length > MAX_MESSAGE_LENGTH
    ) {
      return "Each message must be plain text with at most 1,200 characters.";
    }
  }

  if (messages[messages.length - 1].role !== "user") {
    return "The latest message must be from you.";
  }

  return null;
}

router.post("/chat", authMiddleware, async (req, res) => {
  const validationError = validateMessages(req.body?.messages);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const now = Date.now();
  const windowStartMs = Math.floor(now / WINDOW_MS) * WINDOW_MS;
  const windowStart = new Date(windowStartMs);
  const resetAt = windowStartMs + WINDOW_MS;
  const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - now) / 1000));

  try {
    let usage;
    try {
      usage = await ChatRateLimit.findOneAndUpdate(
        { userId: req.userId, windowStart },
        {
          $inc: { count: 1 },
          $setOnInsert: { expiresAt: new Date(resetAt + WINDOW_MS) },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    } catch (error) {
      // Concurrent first requests can race to create the same unique bucket.
      if (error.code !== 11000) throw error;
      usage = await ChatRateLimit.findOneAndUpdate(
        { userId: req.userId, windowStart },
        { $inc: { count: 1 } },
        { new: true }
      );
    }

    res.set("X-RateLimit-Limit", String(MAX_REQUESTS_PER_WINDOW));
    res.set("X-RateLimit-Remaining", String(Math.max(0, MAX_REQUESTS_PER_WINDOW - usage.count)));
    res.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));

    if (usage.count > MAX_REQUESTS_PER_WINDOW) {
      res.set("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({
        message: "You’ve reached the chat limit. Please try again in a moment.",
        retryAfterSeconds,
      });
    }

    const serviceUrl = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";
    const serviceToken = process.env.AI_SERVICE_TOKEN;
    if (!serviceToken) {
      return res.status(503).json({ message: "Career guidance is not configured yet." });
    }

    const response = await fetch(`${serviceUrl.replace(/\/$/, "")}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Token": serviceToken,
      },
      body: JSON.stringify({ messages: req.body.messages }),
      signal: AbortSignal.timeout(30000),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const status = response.status === 503 ? 503 : 502;
      return res.status(status).json({
        message: status === 503
          ? "Career guidance is temporarily unavailable. Please try again later."
          : "I couldn’t prepare a response just now. Please try again.",
      });
    }

    return res.status(200).json({ reply: result.reply });
  } catch (error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return res.status(504).json({ message: "The reply took too long. Please try again." });
    }
    console.error("Career chatbot request failed:", error.message);
    return res.status(503).json({ message: "Career guidance is temporarily unavailable." });
  }
});

module.exports = router;
