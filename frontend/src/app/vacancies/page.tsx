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

export default function VacanciesPage() {
  const router = useRouter();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [selected, setSelected] = useState<Vacancy | null>(null);

  useEffect(() => {
    async function loadVacancies() {
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

    loadVacancies();
  }, [router]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="mb-6 border border-zinc-700 px-4 py-2 rounded-lg"
        >
          ← Back to Generator
        </button>

        <h1 className="text-4xl font-bold mb-8">My Vacancies</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {vacancies.map((vacancy) => (
              <div
                key={vacancy.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
              >
                <h2 className="text-xl font-bold">{vacancy.title}</h2>
                <p className="text-zinc-400">{vacancy.level} • {vacancy.industry}</p>
                <p className="text-zinc-500 text-sm mt-2">{vacancy.techStack}</p>

                <button
                  onClick={() => setSelected(vacancy)}
                  className="mt-4 bg-cyan-500 text-black font-bold px-4 py-2 rounded"
                >
                  View
                </button>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Vacancy Details</h2>

            <div className="whitespace-pre-wrap text-sm text-zinc-300">
              {selected
                ? selected.description
                : "Select a vacancy to view details."}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}