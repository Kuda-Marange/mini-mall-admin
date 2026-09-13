"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const justCreated = searchParams.get("created") === "1";
  const justReset = searchParams.get("reset") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Tracks whether the current error is specifically "unconfirmed email",
  // so we know whether to offer a resend button, and separately tracks
  // the resend action's own state (idle / sending / sent / error).
  const [showResend, setShowResend] = useState(false);
  const [resendStatus, setResendStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [resendError, setResendError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setShowResend(false);
    setResendStatus("idle");
    setResendError(null);
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        setError(
          "Please confirm your email before signing in. Check your inbox for a confirmation link."
        );
        setShowResend(true);
      } else {
        setError("Incorrect email or password.");
      }

      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleResend() {
    setResendStatus("sending");
    setResendError(null);

    const supabase = createClient();

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      setResendStatus("error");

      // Supabase returns a specific rate-limit error message when the
      // default (testing-only) email sender's hourly cap is hit — surface
      // that distinctly rather than a generic failure.
      if (error.message.toLowerCase().includes("rate limit")) {
        setResendError(
          "Too many attempts. Please wait a while before requesting another email."
        );
      } else {
        setResendError(error.message);
      }

      return;
    }

    setResendStatus("sent");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-lg border bg-card p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold text-foreground">
          Sign in
        </h1>

        <p className="mb-6 text-sm text-muted-foreground">
          Mini Mall admin dashboard
        </p>

        {justCreated && (
          <p className="mb-4 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
            Account created. Check your email for a confirmation link before
            signing in.
          </p>
        )}

        {justReset && (
          <p className="mb-4 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
            Password updated. Sign in with your new password.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-sm text-muted-foreground underline"
            >
              Forgot your password?
            </a>
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          {showResend && (
            <div className="space-y-2 rounded-md border border-border bg-muted/50 p-3">
              {resendStatus === "sent" ? (
                <p className="text-sm text-success">
                  Confirmation email sent. Check your inbox.
                </p>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    disabled={resendStatus === "sending"}
                    onClick={handleResend}
                  >
                    {resendStatus === "sending"
                      ? "Sending…"
                      : "Resend confirmation email"}
                  </Button>

                  {resendStatus === "error" && resendError && (
                    <p className="text-sm text-destructive" role="alert">
                      {resendError}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New admin?{" "}
          <a href="/signup" className="font-medium text-foreground underline">
            Create account
          </a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

