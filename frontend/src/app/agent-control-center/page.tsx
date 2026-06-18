"use client";

import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Brain,
  Clock3,
  Crown,
  FileText,
  GitBranch,
  MessageSquareText,
  Radio,
  SearchCheck,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

type Agent = {
  name: string;
  role: string;
  provider: string;
  status: "online" | "working" | "standby";
};

export default function AgentControlCenterPage() {
  const router = useRouter();

  const agents: Agent[] = [
    {
      name: "Hiring Manager Agent",
      role: "Role Planning",
      provider: "AI/ML API",
      status: "online",
    },
    {
      name: "Recruiter Agent",
      role: "Vacancy Creation",
      provider: "Featherless AI",
      status: "online",
    },
    {
      name: "Resume Screening Agent",
      role: "Candidate Review",
      provider: "AI/ML API",
      status: "online",
    },
    {
      name: "Interview Agent",
      role: "Conversational Interview",
      provider: "Featherless AI",
      status: "working",
    },
    {
      name: "Decision Agent",
      role: "Hiring Recommendation",
      provider: "AI/ML API",
      status: "standby",
    },
  ];

  const stats = [
    {
      label: "Messages Exchanged",
      value: "147",
      icon: MessageSquareText,
    },
    {
      label: "Band Handoffs",
      value: "39",
      icon: GitBranch,
    },
    {
      label: "Workflow Runs",
      value: "18",
      icon: Activity,
    },
    {
      label: "Average Completion Time",
      value: "21 sec",
      icon: Clock3,
    },
    {
      label: "Active Agents",
      value: "5",
      icon: Users,
    },
  ];

  const networkEvents = [
    {
      from: "Hiring Manager Agent",
      to: "Recruiter Agent",
      detail: "Role requirements handed off through Band.ai",
      provider: "AI/ML API → Band.ai",
    },
    {
      from: "Recruiter Agent",
      to: "Resume Screening Agent",
      detail: "Vacancy context prepared for candidate screening",
      provider: "Featherless AI → Band.ai",
    },
    {
      from: "Resume Screening Agent",
      to: "Interview Agent",
      detail: "Candidate score and missing skills passed to interview flow",
      provider: "AI/ML API → Band.ai",
    },
    {
      from: "Interview Agent",
      to: "Decision Agent",
      detail: "Interview transcript handed off for final decision",
      provider: "Featherless AI → Band.ai",
    },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#0f3347,#050505_45%)] text-white p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-300 font-semibold mb-4 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2">
              <Radio size={18} />
              Live Band.ai Agent Network
            </div>

            <h1 className="text-6xl font-bold tracking-tight">
              Agent Control Center
            </h1>

            <p className="text-zinc-400 mt-4 max-w-3xl text-lg">
              Enterprise-grade control room for monitoring autonomous hiring
              agents, Band.ai handoffs, provider usage, and live workflow
              coordination across the recruitment lifecycle.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/")}
              className="border border-zinc-700 px-5 py-3 rounded-xl hover:border-cyan-400 transition"
            >
              Generator
            </button>

            <button
              onClick={() => router.push("/command-center")}
              className="border border-purple-500 text-purple-400 px-5 py-3 rounded-xl hover:bg-purple-500 hover:text-white transition"
            >
              Command Center
            </button>

            <button
              onClick={() => router.push("/interview")}
              className="bg-cyan-500 text-black font-bold px-6 py-3 rounded-xl hover:bg-cyan-400 transition"
            >
              AI Interview
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-5 mb-8">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-[0_0_40px_rgba(34,211,238,0.06)]"
              >
                <Icon className="text-cyan-400 mb-4" size={24} />
                <div className="text-4xl font-bold">{item.value}</div>
                <div className="text-zinc-400 mt-1 text-sm">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="text-cyan-400" />
              <h2 className="text-2xl font-bold">Band.ai Agent Network</h2>
            </div>

            <div className="relative min-h-[520px] rounded-3xl border border-white/10 bg-black/30 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.18),transparent_45%)]" />

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="h-36 w-36 rounded-full bg-cyan-500/20 border border-cyan-300 flex flex-col items-center justify-center shadow-[0_0_70px_rgba(34,211,238,0.55)]">
                  <Zap className="text-cyan-200 mb-2" size={34} />
                  <div className="font-bold text-white text-xl">BAND</div>
                  <div className="text-xs text-cyan-200">Coordination</div>
                </div>
              </div>

              <AgentNode
                className="left-1/2 top-8 -translate-x-1/2"
                icon={<Crown size={22} />}
                color="orange"
                title="Hiring Manager"
                provider="AI/ML API"
              />

              <AgentNode
                className="right-16 top-36"
                icon={<FileText size={22} />}
                color="purple"
                title="Recruiter"
                provider="Featherless AI"
              />

              <AgentNode
                className="right-24 bottom-20"
                icon={<SearchCheck size={22} />}
                color="green"
                title="Resume Agent"
                provider="AI/ML API"
              />

              <AgentNode
                className="left-24 bottom-20"
                icon={<MessageSquareText size={22} />}
                color="pink"
                title="Interview Agent"
                provider="Featherless AI"
              />

              <AgentNode
                className="left-16 top-36"
                icon={<BadgeCheck size={22} />}
                color="cyan"
                title="Decision Agent"
                provider="AI/ML API"
              />

              <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/10" />
              <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/10" />
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
              <h2 className="text-2xl font-bold mb-6">Active Agents</h2>

              <div className="space-y-4">
                {agents.map((agent) => (
                  <div
                    key={agent.name}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            agent.status === "online"
                              ? "bg-green-400"
                              : agent.status === "working"
                              ? "bg-cyan-400 animate-pulse"
                              : "bg-zinc-500"
                          }`}
                        />
                        <div className="font-bold">{agent.name}</div>
                      </div>

                      <div className="text-sm text-zinc-500 mt-1">
                        {agent.role}
                      </div>
                    </div>

                    <div className="text-xs text-cyan-400">
                      {agent.provider}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
              <h2 className="text-2xl font-bold mb-6">
                Provider Distribution
              </h2>

              <div className="space-y-4">
                <ProviderBar label="Band.ai" value={100} color="bg-cyan-400" />
                <ProviderBar
                  label="AI/ML API"
                  value={60}
                  color="bg-green-400"
                />
                <ProviderBar
                  label="Featherless AI"
                  value={40}
                  color="bg-purple-400"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
            <h2 className="text-2xl font-bold mb-6">
              Agent-to-Agent Handoffs
            </h2>

            <div className="space-y-4">
              {networkEvents.map((event) => (
                <div
                  key={`${event.from}-${event.to}`}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <span>{event.from}</span>
                    <ArrowRight className="text-cyan-400" size={18} />
                    <span>{event.to}</span>
                  </div>

                  <p className="text-zinc-400 text-sm mt-2">{event.detail}</p>

                  <div className="text-xs text-cyan-400 mt-3">
                    {event.provider}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 shadow-[0_0_60px_rgba(34,211,238,0.08)]">
            <h2 className="text-2xl font-bold mb-6">Enterprise Readiness</h2>

            <div className="space-y-5">
              <ReadinessItem
                title="Traceable Agent Handoffs"
                text="Each workflow step is represented as a handoff event through Band.ai."
              />

              <ReadinessItem
                title="Cross-Provider Agent Design"
                text="Different agents are powered by AI/ML API and Featherless AI while Band.ai coordinates collaboration."
              />

              <ReadinessItem
                title="Human-in-the-Loop Ready"
                text="Recruiters and hiring managers can review the final decision before action."
              />

              <ReadinessItem
                title="Enterprise Workflow Fit"
                text="The system maps directly to internal HR workflow coordination, screening, interviews, and approvals."
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function AgentNode({
  className,
  icon,
  color,
  title,
  provider,
}: {
  className: string;
  icon: React.ReactNode;
  color: "cyan" | "green" | "purple" | "pink" | "orange";
  title: string;
  provider: string;
}) {
  const colors = {
    cyan: "border-cyan-400 text-cyan-300 bg-cyan-400/10 shadow-cyan-500/30",
    green: "border-green-400 text-green-300 bg-green-400/10 shadow-green-500/30",
    purple:
      "border-purple-400 text-purple-300 bg-purple-400/10 shadow-purple-500/30",
    pink: "border-pink-400 text-pink-300 bg-pink-400/10 shadow-pink-500/30",
    orange:
      "border-orange-400 text-orange-300 bg-orange-400/10 shadow-orange-500/30",
  };

  return (
    <div
      className={`absolute z-20 rounded-2xl border px-5 py-4 min-w-[170px] text-center shadow-2xl ${colors[color]} ${className}`}
    >
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-current">
        {icon}
      </div>
      <div className="font-bold text-white">{title}</div>
      <div className="text-xs mt-1">{provider}</div>
    </div>
  );
}

function ProviderBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-zinc-300">{label}</span>
        <span className="text-zinc-500">{value}%</span>
      </div>

      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ReadinessItem({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
      <div className="flex items-center gap-2 font-bold">
        <ShieldCheck className="text-cyan-400" size={18} />
        {title}
      </div>

      <p className="text-sm text-zinc-400 mt-2">{text}</p>
    </div>
  );
}