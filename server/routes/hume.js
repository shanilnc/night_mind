const express = require("express");
const { fetchAccessToken } = require("hume");

const router = express.Router();

// Generate access token for Hume EVI
router.post("/auth", async (req, res) => {
  try {
    // Check if environment variables are set
    if (!process.env.HUME_API_KEY || !process.env.HUME_SECRET_KEY) {
      return res.status(500).json({
        error: "Hume API credentials not configured",
        message:
          "Please set HUME_API_KEY and HUME_SECRET_KEY in your environment variables",
      });
    }

    console.log("Attempting to fetch Hume access token...");
    console.log("API Key:", process.env.HUME_API_KEY ? "Set" : "Not set");
    console.log("Secret Key:", process.env.HUME_SECRET_KEY ? "Set" : "Not set");

    const accessToken = await fetchAccessToken({
      apiKey: process.env.HUME_API_KEY,
      secretKey: process.env.HUME_SECRET_KEY,
    });

    console.log("Access token result:", accessToken ? "Success" : "Failed");

    if (!accessToken) {
      return res.status(500).json({
        error: "Failed to generate access token",
        message: "No access token received from Hume API",
      });
    }

    res.json({
      accessToken,
      configId: process.env.HUME_CONFIG_ID || null,
    });
  } catch (error) {
    console.error("Hume auth error:", error);

    // Provide more specific error messages
    let errorMessage = "Authentication failed";
    if (error.message) {
      errorMessage = error.message;
    } else if (error.issues && error.issues.length > 0) {
      errorMessage = error.issues[0].message;
    }

    res.status(500).json({
      error: "Authentication failed",
      message: errorMessage,
      details: error.issues || error.stack,
    });
  }
});

// Get Hume configuration
router.get("/config", (req, res) => {
  res.json({
    configId: process.env.HUME_CONFIG_ID || null,
    features: {
      voiceChat: true,
      emotionDetection: true,
      interruptionHandling: true,
    },
  });
});

module.exports = router;
