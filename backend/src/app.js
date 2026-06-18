require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const vacancyRoutes = require("./routes/vacancyRoutes");
const agentRoutes = require("./routes/agentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "AI Recruiter API Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/vacancies", vacancyRoutes);
app.use("/api/agents", agentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});