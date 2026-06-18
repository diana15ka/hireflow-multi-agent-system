"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Activity,
  BadgeCheck,
  Brain,
  CheckCircle2,
  Crown,
  FileText,
  GitBranch,
  MessageSquareText,
  Radio,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

type AgentStep = {
  agent: string;
  provider: string;
  status: "completed" | "active" | "waiting";
  detail: string;
};

type ActivityItem = {
  time: string;
  from: string;
  to: string;
  detail: string;
  provider: string;
};

type IntelligenceScore = {
  label: string;
  value: number;
};

export default function CommandCenterPage() {
  const router = useRouter();
  const [running, setRunning] = useState(false);

  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([
    {
      time: "Ready",
      from: "Band.ai",
      to: "Agent Network",
      detail: "Workflow room is ready for agent collaboration.",
      provider: "Band.ai",
    },
  ]);

  const [scores, setScores] = useState<IntelligenceScore[]>([
    { label: "Technical Fit", value: 92 },
    { label: "Execution Readiness", value: 88 },
    { label: "Communication Fit", value: 86 },
    { label: "Risk Score", value: 12 },
    { label: "Hiring Probability", value: 91 },
  ]);

  const [steps, setSteps] = useState<AgentStep[]>([
    {
      agent: "Hiring Manager Agent",
      provider: "AI/ML API",
      status: "waiting",
      detail: "Waiting to start workflow",
    },
    {
      agent: "Recruiter Agent",
      provider: "Featherless AI",
      status: "waiting",
      detail: "Waiting for Band.ai handoff",
    },
    {
      agent: "Resume Screening Agent",
      provider: "AI/ML API",
      status: "waiting",
      detail: "Waiting for vacancy context",
    },
    {
      agent: "Interview Agent",
      provider: "Featherless AI",
      status: "waiting",
      detail: "Waiting for candidate screening",
    },
    {
      agent: "Decision Agent",
      provider: "AI/ML API",
      status: "waiting",
      detail: "Waiting for final context",
    },
  ]);

  const nodes: Node[] = useMemo(
    () => [
      {
        id: "band",
        position: { x: 460, y: 175 },
        data: {
          label: (
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400/20 border border-cyan-300 shadow-[0_0_45px_rgba(34,211,238,0.75)]">
                <Zap className="text-cyan-200" size={30} />
              </div>
              <div className="font-bold text-white tracking-wide">BAND</div>
              <div className="text-xs text-cyan-200">Collaboration Layer</div>
            </div>
          ),
        },
        style: {
          background: "linear-gradient(135deg,#0e7490,#1d4ed8)",
          color: "white",
          border: "1px solid #22d3ee",
          borderRadius: 999,
          padding: 18,
          width: 200,
          height: 160,
          boxShadow: "0 0 55px rgba(34,211,238,0.5)",
        },
      },
      {
        id: "1",
        position: { x: 470, y: 0 },
        data: {
          label: (
            <div className="text-center">
              <Crown className="mx-auto mb-2 text-orange-400" size={22} />
              <div className="font-bold text-white">Hiring Manager</div>
              <div className="text-xs text-cyan-400">AI/ML API</div>
            </div>
          ),
        },
        style: nodeStyle("#06b6d4"),
      },
      {
        id: "2",
        position: { x: 780, y: 105 },
        data: {
          label: (
            <div className="text-center">
              <FileText className="mx-auto mb-2 text-purple-400" size={22} />
              <div className="font-bold text-white">Recruiter</div>
              <div className="text-xs text-purple-400">Featherless AI</div>
            </div>
          ),
        },
        style: nodeStyle("#a855f7"),
      },
      {
        id: "3",
        position: { x: 720, y: 345 },
        data: {
          label: (
            <div className="text-center">
              <SearchCheck className="mx-auto mb-2 text-green-400" size={22} />
              <div className="font-bold text-white">Resume Screening</div>
              <div className="text-xs text-green-400">AI/ML API</div>
            </div>
          ),
        },
        style: nodeStyle("#22c55e", 190),
      },
      {
        id: "4",
        position: { x: 200, y: 345 },
        data: {
          label: (
            <div className="text-center">
              <MessageSquareText className="mx-auto mb-2 text-pink-400" size={22} />
              <div className="font-bold text-white">Interview Agent</div>
              <div className="text-xs text-purple-400">Featherless AI</div>
            </div>
          ),
        },
        style: nodeStyle("#d946ef"),
      },
      {
        id: "5",
        position: { x: 160, y: 105 },
        data: {
          label: (
            <div className="text-center">
              <BadgeCheck className="mx-auto mb-2 text-cyan-400" size={22} />
              <div className="font-bold text-white">Decision Agent</div>
              <div className="text-xs text-cyan-400">AI/ML API</div>
            </div>
          ),
        },
        style: nodeStyle("#06b6d4"),
      },
    ],
    []
  );

  const edges: Edge[] = useMemo(
    () => [
      edge("band-1", "band", "1", "#22d3ee"),
      edge("band-2", "band", "2", "#a855f7"),
      edge("band-3", "band", "3", "#22c55e"),
      edge("band-4", "band", "4", "#d946ef"),
      edge("band-5", "band", "5", "#38bdf8"),
    ],
    []
  );

  function runDemo() {
    setRunning(true);
    setActivityFeed([
      {
        time: "09:15:00",
        from: "Band.ai",
        to: "Hiring Manager Agent",
        detail: "Workflow started. Role planning context delivered.",
        provider: "Band.ai",
      },
    ]);

    setSteps([
      {
        agent: "Hiring Manager Agent",
        provider: "AI/ML API",
        status: "active",
        detail: "Creating role requirements",
      },
      {
        agent: "Recruiter Agent",
        provider: "Featherless AI",
        status: "waiting",
        detail: "Waiting for Band.ai handoff",
      },
      {
        agent: "Resume Screening Agent",
        provider: "AI/ML API",
        status: "waiting",
        detail: "Waiting for vacancy context",
      },
      {
        agent: "Interview Agent",
        provider: "Featherless AI",
        status: "waiting",
        detail: "Waiting for candidate screening",
      },
      {
        agent: "Decision Agent",
        provider: "AI/ML API",
        status: "waiting",
        detail: "Waiting for final context",
      },
    ]);

    setTimeout(() => {
      addActivity(
        "09:15:04",
        "Hiring Manager Agent",
        "Recruiter Agent",
        "Role requirements handed off through Band.ai.",
        "AI/ML API → Band.ai"
      );
      setSteps((prev) =>
        prev.map((step) =>
          step.agent === "Hiring Manager Agent"
            ? { ...step, status: "completed", detail: "Role requirements sent through Band.ai" }
            : step.agent === "Recruiter Agent"
            ? { ...step, status: "active", detail: "Generating vacancy using Featherless AI" }
            : step
        )
      );
    }, 1200);

    setTimeout(() => {
      addActivity(
        "09:15:08",
        "Recruiter Agent",
        "Resume Screening Agent",
        "Vacancy generated and candidate screening context prepared.",
        "Featherless AI → Band.ai"
      );
      setSteps((prev) =>
        prev.map((step) =>
          step.agent === "Recruiter Agent"
            ? { ...step, status: "completed", detail: "Vacancy handed to Resume Screening Agent" }
            : step.agent === "Resume Screening Agent"
            ? { ...step, status: "active", detail: "Scoring candidate fit using AI/ML API" }
            : step
        )
      );
    }, 2400);

    setTimeout(() => {
      addActivity(
        "09:15:13",
        "Resume Screening Agent",
        "Interview Agent",
        "Candidate score generated: 92%. Interview context handed off.",
        "AI/ML API → Band.ai"
      );
      setSteps((prev) =>
        prev.map((step) =>
          step.agent === "Resume Screening Agent"
            ? { ...step, status: "completed", detail: "Candidate score generated: 92%" }
            : step.agent === "Interview Agent"
            ? { ...step, status: "active", detail: "Running conversational interview" }
            : step
        )
      );
    }, 3600);

    setTimeout(() => {
      addActivity(
        "09:15:18",
        "Interview Agent",
        "Decision Agent",
        "Interview transcript and evaluation signals handed to Decision Agent.",
        "Featherless AI → Band.ai"
      );
      setSteps((prev) =>
        prev.map((step) =>
          step.agent === "Interview Agent"
            ? { ...step, status: "completed", detail: "Interview context handed to Decision Agent" }
            : step.agent === "Decision Agent"
            ? { ...step, status: "active", detail: "Generating final hiring recommendation" }
            : step
        )
      );
    }, 4800);

    setTimeout(() => {
      addActivity(
        "09:15:22",
        "Decision Agent",
        "Hiring Manager",
        "Final recommendation produced: Invite to Interview.",
        "AI/ML API → Band.ai"
      );
      setSteps((prev) =>
        prev.map((step) =>
          step.agent === "Decision Agent"
            ? { ...step, status: "completed", detail: "Recommendation: Invite to Interview" }
            : step
        )
      );
      setScores([
        { label: "Technical Fit", value: 94 },
        { label: "Execution Readiness", value: 90 },
        { label: "Communication Fit", value: 87 },
        { label: "Risk Score", value: 10 },
        { label: "Hiring Probability", value: 93 },
      ]);
      setRunning(false);
    }, 6200);
  }

  function addActivity(
    time: string,
    from: string,
    to: string,
    detail: string,
    provider: string
  ) {
    setActivityFeed((prev) => [{ time, from, to, detail, provider }, ...prev]);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#0f3347,#050505_45%)] text-white p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-300 font-semibold mb-4 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2">
              <Radio size={18} />
              Band.ai Cross-Framework Multi-Agent System
            </div>

            <h1 className="text-6xl font-bold tracking-tight max-w-4xl">
              HireFlow Agent Command Center
            </h1>

            <p className="text-zinc-400 mt-4 max-w-3xl text-lg">
              Enterprise hiring workflow where five specialized agents
              collaborate through Band.ai across planning, execution, review,
              interview, and decision-making.
            </p>
          </div>

          <div className="flex gap-3">
            <button
                onClick={() => router.push("/")}
                className="border border-zinc-700 px-5 py-3 rounded-xl"
            >
                Generator
            </button>

            <button
                onClick={() => router.push("/interview")}
                className="border border-cyan-500 text-cyan-400 px-5 py-3 rounded-xl"
            >
                AI Interview
            </button>

            <button
                onClick={() => router.push("/agent-control-center")}
                className="border border-orange-500 text-orange-400 px-5 py-3 rounded-xl"
            >
                Agent Control Center
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-6 gap-5 mb-8">
          {[
            {value: "127", label: "Agents Executed Today", Icon: Users},
            {value: "354", label: "Agent Handoffs", Icon: GitBranch},
            {value: "98.4%", label: "Workflow Success Rate", Icon: ShieldCheck},
            {value: "742", label: "Band Messages Sent", Icon: Activity},
            {value: "91", label: "Candidates Processed", Icon: SearchCheck},
            {value: "89%", label: "Average Hiring Score", Icon: BadgeCheck},
          ].map(({value, label, Icon}) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 shadow-[0_0_40px_rgba(34,211,238,0.06)]"
            >
              <Icon className="text-cyan-400 mb-4" size={22} />
              <div className="text-3xl font-bold">{value}</div>
              <div className="text-zinc-400 mt-1 text-sm">{label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 h-[560px] overflow-hidden shadow-[0_0_60px_rgba(34,211,238,0.08)]">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="text-cyan-400" />
              <h2 className="text-2xl font-bold">Agent Collaboration Graph</h2>
            </div>

            <ReactFlow nodes={nodes} edges={edges} fitView proOptions={{ hideAttribution: true }}>
              <Background color="#334155" gap={18} />
              <Controls />
            </ReactFlow>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles className="text-cyan-400" />
                <h2 className="text-2xl font-bold">Provider Stack</h2>
              </div>

              <div className="space-y-4">
                <ProviderCard
                  title="Band.ai"
                  color="cyan"
                  text="Real collaboration layer for agent handoffs and workflow rooms."
                />
                <ProviderCard
                  title="Featherless AI"
                  color="purple"
                  text="Powers the Recruiter Agent and conversational Interview Agent."
                />
                <ProviderCard
                  title="AI/ML API"
                  color="green"
                  text="Powers the Hiring Manager, Resume Screening, and Decision Agent."
                />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
              <h2 className="text-2xl font-bold mb-5">Candidate Intelligence</h2>

              <div className="space-y-4">
                {scores.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-300">{item.label}</span>
                      <span className={item.label === "Risk Score" ? "text-orange-400" : "text-cyan-400"}>
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.label === "Risk Score"
                            ? "bg-orange-400"
                            : "bg-cyan-400"
                        }`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-8 mt-8">
          <div className="md:col-span-3 bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
            <h2 className="text-2xl font-bold mb-6">Live Band Agent Timeline</h2>

            <div className="grid md:grid-cols-5 gap-4">
              {steps.map((step) => (
                <div
                  key={step.agent}
                  className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-5 hover:border-cyan-500/50 transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-bold">{step.agent}</div>
                    {step.status === "completed" && (
                      <CheckCircle2 className="text-green-400" size={18} />
                    )}
                    {step.status === "active" && (
                      <Activity className="text-cyan-400 animate-pulse" size={18} />
                    )}
                  </div>

                  <div
                    className={`text-sm font-semibold ${
                      step.status === "completed"
                        ? "text-green-400"
                        : step.status === "active"
                        ? "text-cyan-400"
                        : "text-zinc-500"
                    }`}
                  >
                    {step.status}
                  </div>

                  <div className="text-xs text-zinc-500 mt-2">{step.provider}</div>

                  <p className="text-sm text-zinc-300 mt-4">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
            <h2 className="text-2xl font-bold mb-5">Band Activity Stream</h2>

            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
              {activityFeed.map((item, index) => (
                <div
                  key={`${item.time}-${index}`}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-cyan-400">{item.time}</span>
                    <span className="text-xs text-zinc-500">{item.provider}</span>
                  </div>

                  <div className="font-semibold text-sm">
                    {item.from}{" "}
                    <span className="text-cyan-400">→</span>{" "}
                    {item.to}
                  </div>

                  <p className="text-sm text-zinc-400 mt-2">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function nodeStyle(border: string, width = 180) {
  return {
    background: "#09090b",
    color: "white",
    border: `1px solid ${border}`,
    borderRadius: 16,
    padding: 14,
    width,
    boxShadow: `0 0 25px ${border}33`,
  };
}

function edge(id: string, source: string, target: string, color: string): Edge {
  return {
    id,
    source,
    target,
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: color, strokeWidth: 2 },
  };
}

function ProviderCard({
  title,
  color,
  text,
}: {
  title: string;
  color: "cyan" | "purple" | "green";
  text: string;
}) {
  const styles = {
    cyan: "border-cyan-500/30 text-cyan-400",
    purple: "border-purple-500/30 text-purple-400",
    green: "border-green-500/30 text-green-400",
  };

  return (
    <div className={`bg-zinc-950/70 border rounded-2xl p-4 ${styles[color]}`}>
      <div className="font-bold">{title}</div>
      <p className="text-sm text-zinc-400 mt-1">{text}</p>
    </div>
  );
}
