const express = require("express");
const axios = require("axios");
const prisma = require("../prisma");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { companyName, title, level, industry, techStack } = req.body;

    if (!companyName || !title || !level || !industry || !techStack) {
      return res.status(400).json({
        message: "companyName, title, level, industry and techStack are required",
      });
    }

    const aiResponse = await axios.post(
      `${process.env.AI_SERVICE_URL}/generate-vacancy`,
      {
        companyName,
        title,
        level,
        industry,
        techStack,
      }
    );

    const generatedDescription = aiResponse.data.generated_vacancy;

    const vacancy = await prisma.vacancy.create({
      data: {
        title,
        level,
        industry,
        techStack,
        description: generatedDescription,
        userId: req.user.userId,
      },
    });

    res.status(201).json(vacancy);
  } catch (error) {
    res.status(500).json({
      message: "Vacancy generation failed",
      error: error.message,
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const vacancies = await prisma.vacancy.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(vacancies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/interview-questions", authMiddleware, async (req, res) => {
  try {
    const { title, level, techStack, vacancyText } = req.body;

    if (!title || !level || !techStack || !vacancyText) {
      return res.status(400).json({
        message: "title, level, techStack and vacancyText are required",
      });
    }

    const aiResponse = await axios.post(
      `${process.env.AI_SERVICE_URL}/generate-interview-questions`,
      {
        title,
        level,
        techStack,
        vacancyText,
      }
    );

    res.json({
      interviewQuestions: aiResponse.data.interview_questions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Interview questions generation failed",
      error: error.message,
    });
  }
});

router.post("/match-resume", authMiddleware, async (req, res) => {
  try {
    const { candidateName, title, level, techStack, vacancyText, resumeText } = req.body;

    if (!candidateName || !title || !level || !techStack || !vacancyText || !resumeText) {
      return res.status(400).json({
        message:
          "candidateName, title, level, techStack, vacancyText and resumeText are required",
      });
    }

    const aiResponse = await axios.post(
      `${process.env.AI_SERVICE_URL}/match-resume`,
      {
        title,
        level,
        techStack,
        vacancyText,
        resumeText,
      }
    );

    const analysis = aiResponse.data.resume_match;

    const scoreMatch = analysis.match(/Match Score[^0-9]*(\d+)/i);
    const score = scoreMatch ? Number(scoreMatch[1]) : 0;

    let status = "Review";

    if (score >= 85) {
      status = "Invite to Interview";
    } else if (score >= 60) {
      status = "Maybe";
    } else {
      status = "Reject";
    }

    const candidate = await prisma.candidate.create({
      data: {
        name: candidateName,
        score,
        status,
        skills: techStack,
        resumeText,
        analysis,
        userId: req.user.userId,
      },
    });

    res.json({
      resumeMatch: analysis,
      candidate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Resume matching failed",
      error: error.message,
    });
  }
});

router.post("/optimize-vacancy", authMiddleware, async (req, res) => {
  try {
    const { vacancyText } = req.body;

    if (!vacancyText) {
      return res.status(400).json({
        message: "vacancyText is required",
      });
    }

    const aiResponse = await axios.post(
      `${process.env.AI_SERVICE_URL}/optimize-vacancy`,
      {
        vacancyText,
      }
    );

    res.json({
      optimizedVacancy: aiResponse.data.optimized_vacancy,
    });
  } catch (error) {
    res.status(500).json({
      message: "Vacancy optimization failed",
      error: error.message,
    });
  }
});

router.get("/candidates/list", authMiddleware, async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const vacancy = await prisma.vacancy.findFirst({
      where: {
        id: Number(req.params.id),
        userId: req.user.userId,
      },
    });

    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }

    res.json(vacancy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;