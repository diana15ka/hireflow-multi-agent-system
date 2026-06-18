"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import jsPDF from "jspdf";

export default function Home() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("");
  const [industry, setIndustry] = useState("");
  const [techStack, setTechStack] = useState("");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const [questions, setQuestions] = useState("");
  const [questionsLoading, setQuestionsLoading] = useState(false);

  const [optimizedVacancy, setOptimizedVacancy] = useState("");
  const [optimizationLoading, setOptimizationLoading] = useState(false);

  const [candidateName, setCandidateName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeMatch, setResumeMatch] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);

  async function generateVacancy() {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.post(
        "/api/vacancies",
        {
          companyName,
          title,
          level,
          industry,
          techStack,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(response.data.description);
      setQuestions("");
      setOptimizedVacancy("");
      setResumeMatch("");
    } catch (error) {
      console.error(error);
      setResult("Generation failed.");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  function exportPDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("AI Generated Vacancy", 10, 15);

    doc.setFontSize(11);

    const text = result || "No vacancy generated yet.";
    const splitText = doc.splitTextToSize(text, 180);

    doc.text(splitText, 10, 30);
    doc.save("generated-vacancy.pdf");
  }

  async function generateInterviewQuestions() {
    try {
      setQuestionsLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/api/vacancies/interview-questions",
        {
          title,
          level,
          techStack,
          vacancyText: result,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setQuestions(response.data.interviewQuestions);
    } catch (error) {
      console.error(error);
      setQuestions("Interview questions generation failed.");
    } finally {
      setQuestionsLoading(false);
    }
  }

  async function optimizeVacancy() {
    try {
      setOptimizationLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/api/vacancies/optimize-vacancy",
        {
          vacancyText: result,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOptimizedVacancy(response.data.optimizedVacancy);
    } catch (error) {
      console.error(error);
      setOptimizedVacancy("Optimization failed.");
    } finally {
      setOptimizationLoading(false);
    }
  }

  async function matchResume() {
    try {
      setResumeLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/api/vacancies/match-resume",
        {
          candidateName,
          title,
          level,
          techStack,
          vacancyText: result,
          resumeText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResumeMatch(response.data.resumeMatch);
    } catch (error) {
      console.error(error);
      setResumeMatch("Resume matching failed.");
    } finally {
      setResumeLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-cyan-400 font-semibold mb-2">
              Band.ai Hackathon • Internal Enterprise Workflow
            </p>

            <h1 className="text-5xl font-bold">HireFlow Agents</h1>

            <p className="text-zinc-400 mt-3 max-w-3xl">
              A cross-framework multi-agent hiring system where agents
              collaborate through Band.ai across role planning, vacancy
              creation, resume screening, conversational interviewing, and
              final hiring decisions.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/agent-control-center")}
              className="border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-black transition px-5 py-3 rounded-xl font-semibold"
            >
              Agent Control Center
            </button>

            <button
              onClick={() => router.push("/command-center")}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-3 rounded-lg transition"
            >
              Command Center
            </button>

            <button
              onClick={() => router.push("/interview")}
              className="bg-cyan-500 text-black font-bold px-5 py-3 rounded-lg"
            >
              AI Interview
            </button>

            <button
              onClick={() => router.push("/agent-control-center")}
              className="border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-black transition px-5 py-3 rounded-lg font-semibold"
            >
              Agent Control Center
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="border border-zinc-700 px-5 py-3 rounded-lg"
            >
              Dashboard
            </button>

            <button
              onClick={() => router.push("/candidates")}
              className="border border-zinc-700 px-5 py-3 rounded-lg"
            >
              Candidates
            </button>

            <button
              onClick={() => router.push("/vacancies")}
              className="border border-zinc-700 px-5 py-3 rounded-lg"
            >
              Vacancies
            </button>

            <button
              onClick={logout}
              className="border border-zinc-700 px-5 py-3 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-cyan-400">Band.ai</h3>
            <p className="text-zinc-400 text-sm mt-2">
              Used as the collaboration layer where hiring agents pass context,
              hand off tasks, and coordinate the workflow.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-purple-400">
              Featherless AI
            </h3>
            <p className="text-zinc-400 text-sm mt-2">
              Powers the Recruiter Agent and Interview Agent for vacancy
              writing and conversational technical interviews.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-green-400">AI/ML API</h3>
            <p className="text-zinc-400 text-sm mt-2">
              Powers the Hiring Manager Agent, Resume Screening Agent, and
              Decision Agent for structured evaluation and hiring decisions.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-4 mb-10">
          {[
            ["Hiring Manager Agent", "Defines role requirements."],
            ["Recruiter Agent", "Creates the vacancy."],
            ["Resume Screening Agent", "Scores candidates."],
            ["Interview Agent", "Runs conversational interviews."],
            ["Decision Agent", "Recommends Hire, Hold, or Reject."],
          ].map(([title, description]) => (
            <div
              key={title}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
            >
              <h3 className="font-bold text-cyan-400">{title}</h3>
              <p className="text-zinc-400 text-sm mt-2">{description}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              Hiring Workflow Brief
            </h2>

            <input
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-3 rounded bg-zinc-800 mb-4"
            />

            <input
              placeholder="Position"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded bg-zinc-800 mb-4"
            />

            <input
              placeholder="Level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-3 rounded bg-zinc-800 mb-4"
            />

            <input
              placeholder="Industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full p-3 rounded bg-zinc-800 mb-4"
            />

            <textarea
              placeholder="Tech Stack"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full p-3 rounded bg-zinc-800 mb-4 min-h-[150px]"
            />

            <button
              onClick={generateVacancy}
              disabled={loading}
              className="w-full bg-cyan-500 text-black font-bold py-3 rounded"
            >
              {loading ? "Recruiter Agent Working..." : "Generate Vacancy"}
            </button>

            <button
              onClick={exportPDF}
              disabled={!result}
              className="w-full mt-3 border border-zinc-700 text-white font-bold py-3 rounded disabled:opacity-40"
            >
              Export Vacancy PDF
            </button>

            <button
              onClick={generateInterviewQuestions}
              disabled={!result || questionsLoading}
              className="w-full mt-3 border border-cyan-500 text-cyan-400 font-bold py-3 rounded disabled:opacity-40"
            >
              {questionsLoading
                ? "Interview Agent Working..."
                : "Generate Interview Questions"}
            </button>

            <button
              onClick={optimizeVacancy}
              disabled={!result || optimizationLoading}
              className="w-full mt-3 border border-purple-500 text-purple-400 font-bold py-3 rounded disabled:opacity-40"
            >
              {optimizationLoading
                ? "Recruiter Agent Optimizing..."
                : "Generate Platform Versions"}
            </button>

            <input
              placeholder="Candidate Name"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full p-3 rounded bg-zinc-800 mt-6 mb-3"
            />

            <textarea
              placeholder="Paste candidate resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full p-3 rounded bg-zinc-800 mb-3 min-h-[180px]"
            />

            <button
              onClick={matchResume}
              disabled={!result || !resumeText || !candidateName || resumeLoading}
              className="w-full border border-green-500 text-green-400 font-bold py-3 rounded disabled:opacity-40"
            >
              {resumeLoading
                ? "Resume Screening Agent Working..."
                : "Match Resume & Save Candidate"}
            </button>
          </div>

          <div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Generated Vacancy</h2>

              <div className="whitespace-pre-wrap text-sm text-zinc-300">
                {result || "The Recruiter Agent output will appear here..."}
              </div>
            </div>

            {questions && (
              <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">
                  Interview Questions
                </h2>

                <div className="whitespace-pre-wrap text-sm text-zinc-300">
                  {questions}
                </div>
              </div>
            )}

            {optimizedVacancy && (
              <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">
                  Platform Versions & A/B Testing
                </h2>

                <div className="whitespace-pre-wrap text-sm text-zinc-300">
                  {optimizedVacancy}
                </div>
              </div>
            )}

            {resumeMatch && (
              <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">
                  Resume Match Analysis
                </h2>

                <div className="whitespace-pre-wrap text-sm text-zinc-300">
                  {resumeMatch}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}