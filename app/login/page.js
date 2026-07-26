"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "LANDLORD" && data.user.accountStatus === "PENDING") {
        router.push("/landlord/pending");
      } else if (data.user.role === "LANDLORD") {
        router.push("/landlord");
      } else if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Could not reach the server. Try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#EEF2F4] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md bg-white border border-[#D3DCE0] rounded-xl p-8">
        <h1 className="text-2xl font-semibold text-[#142430] mb-1">Log in</h1>
        <p className="text-sm text-gray-500 mb-6">Welcome back.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#142430] mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required
              className="w-full border border-[#D3DCE0] rounded-md px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#142430] mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border border-[#D3DCE0] rounded-md px-3 py-2 pr-16 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#2568A8]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-[#B4462F] bg-[#FBEDEA] border border-[#B4462F]/30 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2568A8] text-white text-sm font-medium rounded-md py-2.5 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <div className="text-center">
            <a href="/forgot-password" className="text-xs text-[#2568A8] underline hover:text-[#1a4f7f] transition">
              Forgot password?
            </a>
          </div>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Don&apos;t have an account? <a href="/signup" className="text-[#2568A8] underline">Sign up</a>
        </p>
      </div>
    </main>
  );
}
