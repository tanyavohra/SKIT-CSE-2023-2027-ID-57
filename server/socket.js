const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const User = require("./models/User");
const Message = require("./models/Message");

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" },
  });

  // Reject the connection unless it carries a valid JWT
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = String(decoded.userId);
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    // One private room per user, so every open tab of theirs gets messages
    socket.join(`user:${socket.userId}`);

    socket.on("message:send", async ({ to, text } = {}, ack) => {
      const reply = typeof ack === "function" ? ack : () => {};
      try {
        const body = typeof text === "string" ? text.trim() : "";
        if (!body || body.length > 2000) {
          return reply({ ok: false, message: "Message must be 1–2000 characters" });
        }
        if (!mongoose.isValidObjectId(to) || to === socket.userId) {
          return reply({ ok: false, message: "Invalid recipient" });
        }
        if (!(await User.exists({ _id: to }))) {
          return reply({ ok: false, message: "User not found" });
        }

        const msg = await Message.create({ sender: socket.userId, recipient: to, text: body });
        const payload = msg.toJSON();

        io.to(`user:${to}`).emit("message:new", payload);              // recipient, all tabs
        socket.to(`user:${socket.userId}`).emit("message:new", payload); // sender's OTHER tabs
        reply({ ok: true, message: payload });                          // this tab, via ack
      } catch (err) {
        console.error("message:send failed:", err.message);
        reply({ ok: false, message: "Could not send message" });
      }
    });
  });

  return io;
}

module.exports = { initSocket };