"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Field } from "@/components/ui/Field";
import { useAuthStore } from "@/service/auth/store";
import { useCartStore } from "@/service/cart/store";
import { LoginSchema } from "@/service/auth/schema";
import { loginService } from "@/service/auth/service";
import { AUTH_CONFIG } from "@/config/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";
  const reason = searchParams.get("reason");

  const setUser = useAuthStore((s) => s.setUser);
  const items = useCartStore((s) => s.items);
  const mergeWithServerCart = useCartStore((s) => s.mergeWithServerCart);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fillAdmin = () => {
    setEmail(AUTH_CONFIG.demoAdminCredentials.email);
    setPassword(AUTH_CONFIG.demoAdminCredentials.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = LoginSchema.safeParse({ email, password });
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
      // 2s debounced call simulating Spring Boot REST Auth Controller
      const res = await loginService(parsed.data);
      setUser(res.data);

      // Merge local guest cart with server cart upon login
      if (items.length > 0) {
        mergeWithServerCart(items);
      }

      router.push(redirectUrl);
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Login failed" });
      setLoading(false);
    }
  };

  return (
    <div className="card p-8 border line">
      <div className="text-center mb-6">
        <h1 className="serif text-3xl mb-2">Sign In</h1>
        <p className="mute text-xs">Enter your details to access your account</p>
      </div>

      {reason === "admin_required" && (
        <div className="mb-4 p-3 bg-neutral-900 text-white text-xs text-center">
          Admin privilege required to access /admin. Use demo admin credentials below.
        </div>
      )}

      {/* Quick Demo Helper */}
      {/* <div className="mb-6 p-3 bg-[color:var(--bg)] border line text-xs flex items-center justify-between">
        <div>
          <span className="font-semibold block">Demo Admin:</span>
          <span className="mute">admin@tage.studio</span>
        </div>
        <button
          type="button"
          onClick={fillAdmin}
          className="ul uppercase text-[10px] tracking-wider"
        >
          Auto Fill
        </button>
      </div> */}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="flex justify-between items-center text-xs">
          <Link
            href="/auth/forgot-password"
            className="mute hover:text-[color:var(--fg)] underline"
          >
            Forgot password?
          </Link>
        </div>

        {errors.form && <p className="text-xs text-red-600">{errors.form}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn w-full disabled:opacity-60"
        >
          {loading ? "Authenticating via API (2s)..." : "Sign In"}
        </button>
      </form>

      <div className="mt-6 text-center text-xs mute">
        Don’t have an account?{" "}
        <Link href="/auth/register" className="text-[color:var(--fg)] underline">
          Create one
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 mute">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

