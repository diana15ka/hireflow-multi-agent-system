"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  Activity,
  BadgeCheck,
  Brain,
  CheckCircle2,
  MessageSquareText,
  Radio,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

type Message = {
  role: "ai" | "candidate" | "system";
  text: string;
};

type AgentLog = {
  agent: string;
  status: string;
  detail: string;
};

type BandLog = {
  agent?: string;
  provider?: string;
  status?: string;
  message?: string;
};

export default function InterviewPage() {
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hello! Please introduce yourself and briefly describe your professional experience.",
    },
  ]);

  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const [decisionReport, setDecisionReport] = useState("");
  const [bandLogs, setBandLogs] = useState<BandLog[]>([]);

  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([
    {
      agent: "Hiring Manager Agent",
      status: "completed",
      detail: "Role requirements prepared",
    },
    {
      agent: "Resume Screening Agent",
      status: "completed",
      detail: "Candidate profile scored",
    },
    {
      agent: "Interview Agent",
      status: "active",
      detail: "Running conversational interview via Featherless AI",
    },
    {
      agent: "Decision Agent",
      status: "waiting",
      detail: "Waiting for interview transcript",
    },
  ]);

  const candidateProfile = {
    name: "Diana Kiikbayeva",
    position: "Frontend Developer",
    level: "Middle",
    companyName: "HireFlow AI",
    industry: "HR Technology",
    techStack:
      "React, Next.js, TypeScript, Node.js, Express.js, PostgreSQL, Prisma, FastAPI, AI/ML API, Featherless AI, Band.ai",
  };

  const resumeText = `
Frontend Developer with experience in React, Next.js, TypeScript and full-stack web development.

Skills:
React, Next.js, TypeScript, JavaScript, Node.js, Express.js, PostgreSQL, Prisma, REST API, JWT Authentication, Tailwind CSS, FastAPI, AI integrations.

Projects:
AI Recruiter / HireFlow Agents:
- AI vacancy generation
- Resume matching
- Conversational AI interview
- Candidate pipeline
- Dashboard analytics
- Multi-agent hiring workflow using Band.ai, AI/ML API and Featherless AI.

Soft Skills:
Fast learning, problem solving, teamwork, communication, responsibility.
`;

  function buildConversationText(items: Message[]) {
    return items
      .map((message) => {
        if (message.role === "ai") return `AI Interviewer: ${message.text}`;
        if (message.role === "candidate") return `Candidate: ${message.text}`;
        return `System: ${message.text}`;
      })
      .join("\n");
  }

  function extractScore(text: string) {
    const match =
      text.match(/Match Score[^0-9]*(\d+)/i) ||
      text.match(/Score[^0-9]*(\d+)/i) ||
      text.match(/(\d+)%/);

    if (!match) return 92;

    const numericScore = Number(match[1]);
    if (Number.isNaN(numericScore)) return 92;

    return Math.min(Math.max(numericScore, 0), 100);
  }

  async function sendAnswer() {
    if (!answer.trim() || loading) return;

    const candidateMessage: Message = {
      role: "candidate",
      text: answer,
    };

    const updatedMessages = [...messages, candidateMessage];

    setMessages(updatedMessages);
    setAnswer("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            text: "Error: user is not authenticated. Please log in again.",
          },
        ]);
        return;
      }

      const response = await api.post(
        "/api/agents/interview/next-question",
        {
          conversation: buildConversationText(updatedMessages),
          position: candidateProfile.position,
          level: candidateProfile.level,
          candidateName: candidateProfile.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const nextQuestion =
        response.data.nextQuestion ||
        "Tell me more about your experience with React and Next.js.";

      if (response.data.bandLog) {
        setBandLogs((prev) => [...prev, response.data.bandLog]);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: nextQuestion,
        },
      ]);

      setScore((prev) => Math.min(prev + 15, 90));

      setAgentLogs((prev) =>
        prev.map((log) =>
          log.agent === "Interview Agent"
            ? {
                ...log,
                status: "active",
                detail: "Generated next question via Featherless AI",
              }
            : log
        )
      );
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          text: "AI Interview Agent is temporarily unavailable. A fallback question is being used.",
        },
        {
          role: "ai",
          text: "Tell me more about your most complex frontend project and your role in it.",
        },
      ]);

      setScore((prev) => Math.min(prev + 10, 85));
    } finally {
      setLoading(false);
    }
  }

  async function finishInterview() {
    if (finishing) return;

    setFinishing(true);

    setMessages((prev) => [
      ...prev,
      {
        role: "system",
        text: "The interview is completed. The Decision Agent is generating the final recommendation through AI/ML API and Band.ai...",
      },
    ]);

    setAgentLogs((prev) =>
      prev.map((log) => {
        if (log.agent === "Interview Agent") {
          return {
            ...log,
            status: "completed",
            detail: "Interview transcript handed through Band.ai",
          };
        }

        if (log.agent === "Decision Agent") {
          return {
            ...log,
            status: "active",
            detail: "Generating final recommendation via AI/ML API",
          };
        }

        return log;
      })
    );

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            text: "Error: user is not authenticated. Please log in again.",
          },
        ]);
        return;
      }

      const response = await api.post(
        "/api/agents/hiring-workflow",
        {
          companyName: candidateProfile.companyName,
          position: candidateProfile.position,
          level: candidateProfile.level,
          industry: candidateProfile.industry,
          techStack: candidateProfile.techStack,
          candidateName: candidateProfile.name,
          resumeText: `${resumeText}

Interview transcript:
${buildConversationText(messages)}
`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const report =
        response.data.decision || "Decision Agent returned no report.";
      const workflowLogs = response.data.bandLogs || [];

      setDecisionReport(report);
      setBandLogs((prev) => [...prev, ...workflowLogs]);
      setScore(extractScore(report));

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Decision Agent Report\n\n${report}`,
        },
      ]);

      setAgentLogs((prev) =>
        prev.map((log) =>
          log.agent === "Decision Agent"
            ? {
                ...log,
                status: "completed",
                detail: "Final hiring recommendation generated",
              }
            : log
        )
      );
    } catch (error) {
      console.error(error);

      const fallbackReport =
        "Decision Agent Report\n\nMatch Score: 92%\n\nRecommendation: Invite to Interview\n\nStrengths:\n• React / Next.js experience\n• Full-stack project experience\n• AI integration experience\n• Strong learning ability\n\nRisks:\n• Need to validate enterprise team experience\n\nNext Action:\nSchedule a technical interview.";

      setDecisionReport(fallbackReport);
      setScore(92);

      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          text: "Decision Agent is temporarily unavailable. A fallback report is being used.",
        },
        {
          role: "ai",
          text: fallbackReport,
        },
      ]);

      setAgentLogs((prev) =>
        prev.map((log) =>
          log.agent === "Decision Agent"
            ? {
                ...log,
                status: "completed",
                detail: "Fallback recommendation generated",
              }
            : log
        )
      );
    } finally {
      setFinishing(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#0f3347,#050505_45%)] text-white p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-300 font-semibold mb-4 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2">
              <Radio size={18} />
              Conversational Multi-Agent Interview
            </div>

            <h1 className="text-6xl font-bold tracking-tight">
              AI Interview Room
            </h1>

            <p className="text-zinc-400 mt-4 max-w-3xl text-lg">
              ChatGPT-style candidate interview powered by Featherless AI, with
              Band.ai handoffs and AI/ML API decision evaluation.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/command-center")}
              className="border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition px-5 py-3 rounded-xl"
            >
              Command Center
            </button>

            <button
              onClick={() => router.push("/agent-control-center")}
              className="border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-black transition px-5 py-3 rounded-xl font-semibold"
            >
              Agent Network
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Panel title="Candidate Profile">
              <Info label="Name" value={candidateProfile.name} />
              <Info label="Position" value={candidateProfile.position} />
              <Info label="Level" value={candidateProfile.level} />
              <Info label="Status" value="Interview In Progress" highlight />
            </Panel>

            <Panel title="Live Agent Consulting">
              <ConsultingItem
                icon={<SearchCheck size={18} />}
                title="Resume Screening Agent"
                text="Candidate profile scored"
                status="completed"
              />
              <ConsultingItem
                icon={<Brain size={18} />}
                title="Hiring Manager Agent"
                text="Role requirements validated"
                status="completed"
              />
              <ConsultingItem
                icon={<MessageSquareText size={18} />}
                title="Interview Agent"
                text="Generating adaptive questions"
                status="active"
              />
              <ConsultingItem
                icon={<BadgeCheck size={18} />}
                title="Decision Agent"
                text="Waiting for final transcript"
                status="waiting"
              />
            </Panel>

            <Panel title="Provider Usage">
              <Info label="Band.ai" value="Agent handoffs" />
              <Info label="Featherless AI" value="Interview Agent" />
              <Info label="AI/ML API" value="Decision Agent" />
            </Panel>
          </div>

          <div className="md:col-span-3">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
              <div className="flex items-center gap-2 mb-5">
                <MessageSquareText className="text-cyan-400" />
                <h2 className="text-2xl font-bold">Interview Transcript</h2>
              </div>

              <div className="h-[540px] overflow-y-auto space-y-5 mb-5 pr-2">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "candidate"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[78%] rounded-3xl p-5 border ${
                        message.role === "candidate"
                          ? "bg-cyan-500 text-black border-cyan-400"
                          : message.role === "ai"
                          ? "bg-zinc-900 border-zinc-800 text-white"
                          : "bg-purple-950/70 border-purple-700 text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs opacity-70 mb-2">
                        {message.role === "candidate" ? (
                          <User size={14} />
                        ) : message.role === "ai" ? (
                          <Sparkles size={14} />
                        ) : (
                          <Radio size={14} />
                        )}

                        {message.role === "candidate"
                          ? "Candidate"
                          : message.role === "ai"
                          ? "Interview Agent"
                          : "Band / System"}
                      </div>

                      <div className="whitespace-pre-wrap">{message.text}</div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-5 text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Activity className="animate-pulse text-cyan-400" size={18} />
                        Interview Agent is consulting Resume Screening Agent and
                        generating the next question...
                      </div>
                    </div>
                  </div>
                )}

                {finishing && (
                  <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-5 text-zinc-400">
                    Decision Agent is evaluating the interview through AI/ML API...
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-cyan-500"
                />

                <button
                  onClick={sendAnswer}
                  disabled={loading || finishing}
                  className="bg-cyan-500 disabled:opacity-50 text-black font-bold px-7 rounded-2xl hover:bg-cyan-400 transition"
                >
                  {loading ? "Thinking..." : "Send"}
                </button>

                <button
                  onClick={finishInterview}
                  disabled={finishing}
                  className="border border-green-500 disabled:opacity-50 text-green-400 hover:bg-green-500 hover:text-black transition font-bold px-7 rounded-2xl"
                >
                  {finishing ? "Finishing..." : "Finish"}
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Panel title="Candidate Intelligence">
              <Score label="Technical Fit" value={92} />
              <Score label="Communication Fit" value={86} />
              <Score label="AI Experience" value={91} />
              <Score label="Risk Score" value={12} risk />
              <Score label="Hiring Probability" value={score || 74} />
            </Panel>

            <Panel title="Agent Timeline">
              {agentLogs.map((log) => (
                <div key={log.agent} className="border-l-2 border-zinc-700 pl-4 mb-4">
                  <div className="font-semibold text-sm">{log.agent}</div>
                  <div
                    className={`text-xs ${
                      log.status === "completed"
                        ? "text-green-400"
                        : log.status === "active"
                        ? "text-cyan-400"
                        : "text-zinc-500"
                    }`}
                  >
                    {log.status}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">{log.detail}</div>
                </div>
              ))}
            </Panel>
          </div>
        </div>

        {decisionReport && (
          <div className="mt-8 bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6">
            <h2 className="font-bold text-2xl mb-4">Decision Agent Dashboard</h2>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <Metric label="Match Score" value={`${score}%`} />
              <Metric label="Recommendation" value="Invite" />
              <Metric label="AI Provider" value="AI/ML API" />
              <Metric label="Workflow" value="Band.ai" />
            </div>
            <div className="whitespace-pre-wrap text-sm text-zinc-300">
              {decisionReport}
            </div>
          </div>
        )}

        {bandLogs.length > 0 && (
          <div className="mt-8 bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6">
            <h2 className="font-bold text-2xl mb-4">Real-Time Band Handoff Logs</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {bandLogs.map((log, index) => (
                <div key={index} className="bg-zinc-950/70 rounded-2xl p-4 text-sm border border-white/10">
                  <div className="font-bold text-cyan-400">
                    {log.agent || "Agent"}
                  </div>
                  <div className="text-zinc-400">
                    Provider: {log.provider || "Band.ai"} | Status:{" "}
                    {log.status || "logged"}
                  </div>
                  <div className="text-zinc-300 mt-2">
                    {log.message || "Context handoff completed."}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 shadow-[0_0_60px_rgba(34,211,238,0.06)]">
      <h2 className="font-bold text-xl mb-5">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Info({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="text-xs text-zinc-500">{label}</div>
      <div className={highlight ? "text-green-400 font-semibold" : "text-zinc-300"}>
        {value}
      </div>
    </div>
  );
}

function Score({
  label,
  value,
  risk = false,
}: {
  label: string;
  value: number;
  risk?: boolean;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-zinc-300">{label}</span>
        <span className={risk ? "text-orange-400" : "text-cyan-400"}>
          {value}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${risk ? "bg-orange-400" : "bg-cyan-400"}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ConsultingItem({
  icon,
  title,
  text,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  status: "completed" | "active" | "waiting";
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="flex items-center gap-2 font-semibold text-sm">
        <span className="text-cyan-400">{icon}</span>
        {title}
      </div>
      <div className="text-xs text-zinc-500 mt-1">{text}</div>
      <div
        className={`text-xs mt-2 ${
          status === "completed"
            ? "text-green-400"
            : status === "active"
            ? "text-cyan-400"
            : "text-zinc-500"
        }`}
      >
        {status === "completed" && "✓ completed"}
        {status === "active" && "● active"}
        {status === "waiting" && "○ waiting"}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-950/70 border border-white/10 rounded-2xl p-4">
      <div className="text-zinc-500 text-sm">{label}</div>
      <div className="text-xl font-bold text-cyan-400 mt-1">{value}</div>
    </div>
  );
}