"use client";

import { useState } from "react";
import Link from "next/link";
import { Field } from "@/components/ui/Field";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="card p-8 border line">
      <div className="text-center mb-6">
        <h1 className="serif text-3xl mb-2">Reset Password</h1>
        <p className="mute text-xs">
          Enter your email to receive password reset instructions
        </p>
      </div>

      {sent ? (
        <div className="text-center py-6">
          <p className="text-sm mb-4">
            Reset link has been dispatched to <strong>{email}</strong>.
          </p>
          <Link href="/auth/login" className="btn text-xs">
            Return to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            label="Email Address"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            type="email"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn w-full disabled:opacity-60"
          >
            {loading ? "Sending link..." : "Send Reset Link"}
          </button>

          <div className="text-center pt-2">
            <Link href="/auth/login" className="mute text-xs underline">
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

