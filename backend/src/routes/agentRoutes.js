const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/hiring-workflow", authMiddleware, async (req, res) => {
  try {
    const {
      companyName,
      position,
      level,
      industry,
      techStack,
      candidateName,
      resumeText,
    } = req.body;

    if (
      !companyName ||
      !position ||
      !level ||
      !industry ||
      !techStack ||
      !candidateName ||
      !resumeText
    ) {
      return res.status(400).json({
        message:
          "companyName, position, level, industry, techStack, candidateName and resumeText are required",
      });
    }

    const aiResponse = await axios.post(
      `${process.env.AI_SERVICE_URL}/hiring-workflow`,
      {
        companyName,
        position,
        level,
        industry,
        techStack,
        candidateName,
        resumeText,
      }
    );

    res.json(aiResponse.data);
  } catch (error) {
    res.status(500).json({
      message: "Hiring workflow failed",
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

router.post("/interview/next-question", authMiddleware, async (req, res) => {
  try {
    const { conversation, position, level, candidateName } = req.body;

    if (!conversation || !position || !level || !candidateName) {
      return res.status(400).json({
        message: "conversation, position, level and candidateName are required",
      });
    }

    const aiResponse = await axios.post(
      `${process.env.AI_SERVICE_URL}/interview-agent`,
      {
        conversation,
        position,
        level,
        candidateName,
      }
    );

    res.json(aiResponse.data);
  } catch (error) {
    res.status(500).json({
      message: "Interview agent failed",
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

module.exports = router;