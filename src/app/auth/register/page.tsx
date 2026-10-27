"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/Field";
import { useAuthStore } from "@/service/auth/store";
import { RegisterSchema } from "@/service/auth/schema";
import { registerService } from "@/service/auth/service";

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = RegisterSchema.safeParse({ name, email, password });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await registerService(parsed.data);
      setUser(res.data);
      router.push("/account");
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Registration failed" });
      setLoading(false);
    }
  };

  return (
    <div className="card p-8 border line">
      <div className="text-center mb-6">
        <h1 className="serif text-3xl mb-2">Create Account</h1>
        <p className="mute text-xs">Join TAGE for exclusive releases and faster checkout</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          label="Full Name"
          value={name}
          onChange={setName}
          placeholder="Alexander Wang"
          error={errors.name}
        />
        <Field
          label="Email Address"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          type="email"
          error={errors.email}
        />
        <Field
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
          error={errors.password}
        />

        {errors.form && <p className="text-xs text-red-600">{errors.form}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn w-full disabled:opacity-60"
        >
          {loading ? "Creating Account (2s)..." : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center text-xs mute">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-[color:var(--fg)] underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}

