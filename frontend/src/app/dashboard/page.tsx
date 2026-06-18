"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Vacancy = {
  id: number;
  title: string;
  level: string;
  industry: string;
  techStack: string;
  description: string;
  createdAt: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.get("/api/vacancies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVacancies(response.data);
    }

    loadData();
  }, [router]);

  const today = new Date().toDateString();

  const generatedToday = vacancies.filter(
    (vacancy) => new Date(vacancy.createdAt).toDateString() === today
  ).length;

  const allStacks = vacancies
    .flatMap((vacancy) => vacancy.techStack.split(","))
    .map((skill) => skill.trim())
    .filter(Boolean);

  const mostUsedStack =
    allStacks.length > 0
      ? allStacks.sort(
          (a, b) =>
            allStacks.filter((skill) => skill === b).length -
            allStacks.filter((skill) => skill === a).length
        )[0]
      : "No data";

  const latestVacancy = vacancies[0]?.title || "No vacancies yet";

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-bold">Dashboard</h1>
            <p className="text-zinc-400 mt-2">
              AI Recruiter analytics overview
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="border border-zinc-700 px-5 py-3 rounded-lg"
          >
            Back to Generator
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400">Total Vacancies</p>
            <h2 className="text-4xl font-bold mt-3">{vacancies.length}</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400">Generated Today</p>
            <h2 className="text-4xl font-bold mt-3">{generatedToday}</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400">Most Used Stack</p>
            <h2 className="text-2xl font-bold mt-3">{mostUsedStack}</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400">Latest Vacancy</p>
            <h2 className="text-2xl font-bold mt-3">{latestVacancy}</h2>
          </div>
        </div>
      </div>
    </main>
  );
}