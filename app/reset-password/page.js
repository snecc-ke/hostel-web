"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or expired reset link.");
    }
  }, [token]);

  function getPasswordChecks(password) {
    return {
      length: password.length >= 8,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    };
  }

  const checks = getPasswordChecks(form.password);
  const passwordsMatch = form.password && form.password === form.confirmPassword;
  const canSubmit = checks.length && checks.hasLetter && checks.hasNumber && passwordsMatch;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!passwordsMatch) {
      setError("Passwords don't match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.password }),
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
        <h1 className="text-2xl font-semibold text-[#142430] mb-1">Create a new password</h1>
        <p className="text-sm text-gray-500 mb-6">Enter a strong password below.</p>

        {success ? (
          <div className="space-y-4">
            <div className="bg-[#E7F2ED] border border-[#1F6F54]/30 rounded-md px-4 py-3">
              <p className="text-sm text-[#1F6F54] font-medium mb-2">Password updated</p>
              <p className="text-xs text-[#1F6F54]">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-[#2568A8] text-white text-sm font-medium rounded-md py-2.5"
            >
              Go to login
            </button>
          </div>
        ) : error && error.includes("Invalid or expired") ? (
          <div className="space-y-4">
            <div className="bg-[#FBEDEA] border border-[#B4462F]/30 rounded-md px-4 py-3">
              <p className="text-sm text-[#B4462F] font-medium">{error}</p>
              <p className="text-xs text-[#B4462F] mt-2">
                Reset links expire after 1 hour. Please request a new one.
              </p>
            </div>
            <button
              onClick={() => router.push("/forgot-password")}
              className="w-full bg-[#2568A8] text-white text-sm font-medium rounded-md py-2.5"
            >
              Request new link
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#142430] mb-1">New password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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
              {form.password && (
                <ul className="text-xs text-gray-600 mt-2 space-y-1">
                  <li className={checks.length ? "text-[#1F6F54]" : ""}>
                    {checks.length ? "✓" : "✗"} At least 8 characters
                  </li>
                  <li className={checks.hasLetter ? "text-[#1F6F54]" : ""}>
                    {checks.hasLetter ? "✓" : "✗"} Contains a letter
                  </li>
                  <li className={checks.hasNumber ? "text-[#1F6F54]" : ""}>
                    {checks.hasNumber ? "✓" : "✗"} Contains a number
                  </li>
                </ul>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#142430] mb-1">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                  className="w-full border border-[#D3DCE0] rounded-md px-3 py-2 pr-16 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#2568A8]"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
              {form.confirmPassword && !passwordsMatch && (
                <p className="text-xs text-[#B4462F] mt-2">Passwords don&apos;t match</p>
              )}
              {form.confirmPassword && passwordsMatch && (
                <p className="text-xs text-[#1F6F54] mt-2">✓ Passwords match</p>
              )}
            </div>

            {error && (
              <p className="text-sm text-[#B4462F] bg-[#FBEDEA] border border-[#B4462F]/30 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="w-full bg-[#2568A8] text-white text-sm font-medium rounded-md py-2.5 disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        )}

        <p className="text-sm text-gray-500 mt-6 text-center">
          <a href="/login" className="text-[#2568A8] underline">Back to login</a>
        </p>
      </div>
    </main>
  );
}
