"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShoppingBag,
} from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <main className="min-h-screen overflow-x-hidden bg-muted/30 px-3 py-3 sm:px-4 sm:py-4">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-6xl items-center sm:min-h-[calc(100vh-2rem)]">
        <div className="grid w-full overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm lg:grid-cols-2 lg:rounded-[28px]">
          {/* ================= LEFT BRANDING PANEL ================= */}
          <div className="relative hidden overflow-hidden bg-primary p-8 text-primary-foreground lg:flex lg:min-h-[620px] lg:flex-col lg:justify-between">
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-32 -top-32 h-[380px] w-[380px] rounded-full border border-primary-foreground/10">
              <div className="absolute inset-10 rounded-full border border-primary-foreground/10">
                <div className="absolute inset-10 rounded-full border border-primary-foreground/10">
                  <div className="absolute inset-10 rounded-full border border-primary-foreground/10" />
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="relative z-10">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground text-primary">
                  <ShoppingBag className="h-4 w-4" />
                </div>

                <span className="text-base font-semibold tracking-tight">
                  Mini Mall
                </span>
              </Link>
            </div>

            {/* Main message */}
            <div className="relative z-10 max-w-md">
              <p className="mb-3 text-xs font-medium text-primary-foreground/60">
                Store administration
              </p>

              <h1 className="text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
                Everything you need to run your store.
              </h1>

              <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/70">
                Manage products, orders and your store from one simple
                dashboard.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-primary-foreground/10 bg-primary-foreground/5 px-3 py-1.5 text-xs text-primary-foreground/70">
                  Products
                </span>

                <span className="rounded-full border border-primary-foreground/10 bg-primary-foreground/5 px-3 py-1.5 text-xs text-primary-foreground/70">
                  Orders
                </span>

                <span className="rounded-full border border-primary-foreground/10 bg-primary-foreground/5 px-3 py-1.5 text-xs text-primary-foreground/70">
                  Storefront
                </span>
              </div>
            </div>

            <p className="relative z-10 text-[11px] text-primary-foreground/40">
              © {new Date().getFullYear()} Mini Mall
            </p>
          </div>

          {/* ================= LOGIN PANEL ================= */}
          <div className="flex min-w-0 items-center justify-center px-4 py-6 sm:px-8 sm:py-8 lg:min-h-[620px] lg:px-12">
            <div className="w-full max-w-md">
              {/* Mobile logo */}
              <div className="mb-6 flex justify-center lg:hidden">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2.5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <ShoppingBag className="h-4 w-4" />
                  </div>

                  <span className="text-base font-semibold tracking-tight">
                    Mini Mall
                  </span>
                </Link>
              </div>

              {/* Heading */}
              <div className="mb-5 text-center lg:text-left">
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                  Store administration
                </p>

                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Welcome back
                </h2>

                <p className="mt-1.5 text-xs leading-5 text-muted-foreground sm:text-sm">
                  Sign in to manage your Mini Mall store.
                </p>
              </div>

              {/* Account created message */}
              {justCreated && (
                <div className="mb-4 flex gap-2.5 rounded-lg border border-success/20 bg-success/10 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />

                  <p className="text-xs leading-5 text-success">
                    Account created. Check your email for a confirmation
                    link before signing in.
                  </p>
                </div>
              )}

              {/* Password reset message */}
              {justReset && (
                <div className="mb-4 flex gap-2.5 rounded-lg border border-success/20 bg-success/10 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />

                  <p className="text-xs leading-5 text-success">
                    Password updated. Sign in with your new password.
                  </p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                noValidate
              >
                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs">
                    Email address
                  </Label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-10 pl-8 text-sm placeholder:text-xs"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="password" className="text-xs">
                      Password
                    </Label>

                    <Link
                      href="/forgot-password"
                      className="shrink-0 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-10 pl-8 pr-9 text-sm placeholder:text-xs"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div
                    className="flex gap-2.5 rounded-lg border border-destructive/20 bg-destructive/5 p-3"
                    role="alert"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />

                    <p className="text-xs leading-5 text-destructive">
                      {error}
                    </p>
                  </div>
                )}

                {/* Resend confirmation */}
                {showResend && (
                  <div className="rounded-lg border border-border bg-muted/40 p-3">
                    {resendStatus === "sent" ? (
                      <div className="flex gap-2.5">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />

                        <p className="text-xs leading-5 text-success">
                          Confirmation email sent. Check your inbox.
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="mb-2.5 text-[11px] leading-4 text-muted-foreground">
                          Didn&apos;t receive the confirmation email?
                        </p>

                        <Button
                          type="button"
                          variant="outline"
                          className="h-9 w-full text-xs"
                          disabled={resendStatus === "sending"}
                          onClick={handleResend}
                        >
                          {resendStatus === "sending"
                            ? "Sending..."
                            : "Resend confirmation email"}
                        </Button>

                        {resendStatus === "error" &&
                          resendError && (
                            <p
                              className="mt-2 text-[11px] text-destructive"
                              role="alert"
                            >
                              {resendError}
                            </p>
                          )}
                      </>
                    )}
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  className="h-10 w-full text-sm"
                  disabled={loading}
                >
                  {loading ? (
                    "Signing in..."
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Register */}
              <p className="mt-5 text-center text-xs text-muted-foreground">
                New admin?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  Create an account
                </Link>
              </p>

              <p className="mt-4 text-center text-[10px] leading-4 text-muted-foreground/60">
                Your account is securely authenticated through Supabase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}