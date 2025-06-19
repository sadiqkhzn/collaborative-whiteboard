require("dotenv").config({ path: "../.env" }); // Since server/ is one level below root
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { Whiteboard } = require("../db");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Socket.IO handlers
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`); // ✅ FIXED: added backticks
  });

  socket.on("draw", ({ roomId, data }) => {
    socket.to(roomId).emit("draw", data);
  });

  socket.on("save", async ({ roomId, drawing }) => {
    await Whiteboard.upsert({ roomId, drawingData: drawing });
  });
});

// API routes
app.get("/api/session/:roomId", async (req, res) => {
  const session = await Whiteboard.findOne({ where: { roomId: req.params.roomId } });
  if (!session) return res.status(404).send("Session not found");
  res.json(session);
});

// Add after your existing GET route
app.post("/api/save", async (req, res) => {
  const { roomId, drawing } = req.body;

  if (!roomId || !drawing) {
    return res.status(400).json({ error: "Missing roomId or drawing data." });
  }

  try {
    await Whiteboard.upsert({
      roomId,
      drawingData: drawing,
    });
    res.status(200).json({ message: "Whiteboard saved." });
  } catch (error) {
    console.error("Error saving whiteboard:", error);
    res.status(500).json({ error: "Failed to save whiteboard." });
  }
});