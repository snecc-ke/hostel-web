"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError("Could not reach the server. Try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#EEF2F4] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md bg-white border border-[#D3DCE0] rounded-xl p-8">
        <h1 className="text-2xl font-semibold text-[#142430] mb-1">Reset your password</h1>
        <p className="text-sm text-gray-500 mb-6">Enter your email and we&apos;ll send you a link to reset it.</p>

        {success ? (
          <div className="space-y-4">
            <div className="bg-[#E7F2ED] border border-[#1F6F54]/30 rounded-md px-4 py-3">
              <p className="text-sm text-[#1F6F54] font-medium mb-2">Check your email</p>
              <p className="text-xs text-[#1F6F54]">
                We&apos;ve sent a password reset link to <strong>{email}</strong>. The link expires in 1 hour.
              </p>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-[#2568A8] text-white text-sm font-medium rounded-md py-2.5"
            >
              Back to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#142430] mb-1">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full border border-[#D3DCE0] rounded-md px-3 py-2 text-sm placeholder-gray-400"
              />
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
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <p className="text-sm text-gray-500 mt-6 text-center">
          Remember your password? <a href="/login" className="text-[#2568A8] underline">Log in</a>
        </p>
      </div>
    </main>
  );
}
