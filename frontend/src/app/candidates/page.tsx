"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Candidate = {
  id: number;
  name: string;
  score: number;
  status: string;
  skills: string;
  analysis: string;
  createdAt: string;
};

export default function CandidatesPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selected, setSelected] = useState<Candidate | null>(null);

  useEffect(() => {
    async function loadCandidates() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.get("/api/vacancies/candidates/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCandidates(response.data);
    }

    loadCandidates();
  }, [router]);

  const interviewReady = candidates.filter(
    (candidate) => candidate.status === "Invite to Interview"
  ).length;

  const averageScore =
    candidates.length > 0
      ? Math.round(
          candidates.reduce((sum, candidate) => sum + candidate.score, 0) /
            candidates.length
        )
      : 0;

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="mb-6 border border-zinc-700 px-4 py-2 rounded-lg"
        >
          ← Back to Generator
        </button>

        <h1 className="text-5xl font-bold mb-2">Candidate Pipeline</h1>
        <p className="text-zinc-400 mb-10">
          Real candidates saved from AI resume matching
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400">Total Candidates</p>
            <h2 className="text-4xl font-bold mt-3">{candidates.length}</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400">Interview Ready</p>
            <h2 className="text-4xl font-bold mt-3">{interviewReady}</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400">Average Match</p>
            <h2 className="text-4xl font-bold mt-3">{averageScore}%</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-zinc-800 text-zinc-300">
                <tr>
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Match</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="border-t border-zinc-800">
                    <td className="p-4 font-semibold">{candidate.name}</td>
                    <td className="p-4 text-cyan-400 font-bold">
                      {candidate.score}%
                    </td>
                    <td className="p-4">{candidate.status}</td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelected(candidate)}
                        className="bg-cyan-500 text-black font-bold px-3 py-2 rounded"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Candidate Analysis</h2>

            <div className="whitespace-pre-wrap text-sm text-zinc-300">
              {selected
                ? selected.analysis
                : "Select a candidate to view AI analysis."}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}