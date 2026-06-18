"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("diana@test.com");
  const [password, setPassword] = useState("$1$7$492");
  const [error, setError] = useState("");

  async function login() {
    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      router.push("/");
    } catch {
      setError("Login failed");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <div className="w-[400px] bg-zinc-900 p-8 rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">
          AI Recruiter Login
        </h1>

        <input
          className="w-full p-3 mb-3 bg-zinc-800 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 mb-3 bg-zinc-800 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 mb-3">{error}</p>
        )}

        <button
          onClick={login}
          className="w-full bg-cyan-500 text-black font-bold py-3 rounded"
        >
          Login
        </button>
      </div>
    </main>
  );
}