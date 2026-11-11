const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const jobRoutes = require("./routes/jobRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const http = require("http");
const { initSocket } = require("./socket");
const messageRoutes = require("./routes/messageRoutes");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "12kb" }));
app.use("/api/messages", messageRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Test route

app.get("/", (req, res) => {
    res.send("Alumni Connect Backend is running!");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        const PORT = process.env.PORT || 5000;

        const httpServer = http.createServer(app);
        initSocket(httpServer);

        httpServer.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });
