require("dotenv").config();
const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chat");
const journalRoutes = require("./routes/journal");
const humeRoutes = require("./routes/hume");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "NightMind Backend" });
});

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/hume", humeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`NightMind backend running on port ${PORT}`);
});
