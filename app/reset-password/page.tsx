"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Circle,
  LockKeyhole,
  ShoppingBag,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PASSWORD_CHECKS: {
  label: string;
  test: (pw: string) => boolean;
}[] = [
  { label: "At least 13 characters", test: (pw) => pw.length >= 13 },
  { label: "A lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "An uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "A number", test: (pw) => /[0-9]/.test(pw) },
  { label: "A symbol", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

export default function ResetPasswordPage() {
  const router = useRouter();

  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
      setCheckingSession(false);
    });
  }, []);

  const allChecksPassed = PASSWORD_CHECKS.every((check) =>
    check.test(password)
  );

  const passwordsMatch =
    password.length > 0 && password === confirmPassword;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!allChecksPassed) {
      setError("Password doesn't meet the requirements below.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Sign out and require a fresh login.
    await supabase.auth.signOut();

    router.push("/login?reset=1");
  }

  /*
   * Loading state
   */
  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </main>
    );
  }

  /*
   * Invalid / expired reset link
   */
  if (!hasSession) {
    return (
      <main className="min-h-screen bg-muted/30 px-4 py-4 sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-md items-center justify-center">
          <div className="w-full rounded-2xl border border-border/60 bg-background p-7 text-center shadow-sm sm:p-8">
            {/* Logo */}
            <Link
              href="/"
              className="mb-7 inline-flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ShoppingBag className="h-4 w-4" />
              </div>

              <span className="text-base font-semibold tracking-tight">
                Mini Mall
              </span>
            </Link>

            <div className="mb-6">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <LockKeyhole className="h-5 w-5 text-muted-foreground" />
              </div>

              <h1 className="text-xl font-semibold tracking-tight">
                Link expired or invalid
              </h1>

              <p className="mt-2 text-sm leading-5 text-muted-foreground">
                Please request a new password reset link.
              </p>
            </div>

            <Button asChild className="h-10 w-full">
              <Link href="/forgot-password">
                Request a new link
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Reset password form
   */
  return (
    <main className="min-h-screen bg-muted/30 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-border/60 bg-background shadow-sm lg:grid-cols-2">
          {/* Left branding panel */}
          <div className="relative hidden overflow-hidden bg-primary p-8 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-28 -top-28 h-[360px] w-[360px] rounded-full border border-primary-foreground/10">
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
                className="inline-flex items-center gap-3"
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
              <p className="mb-3 text-xs text-primary-foreground/60">
                Account security
              </p>

              <h1 className="text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
                Keep your account secure.
              </h1>

              <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/65">
                Create a strong password to keep your Mini Mall account
                protected.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <div className="rounded-full border border-primary-foreground/10 bg-primary-foreground/5 px-3 py-1.5 text-xs text-primary-foreground/70">
                  Secure
                </div>

                <div className="rounded-full border border-primary-foreground/10 bg-primary-foreground/5 px-3 py-1.5 text-xs text-primary-foreground/70">
                  Protected
                </div>

                <div className="rounded-full border border-primary-foreground/10 bg-primary-foreground/5 px-3 py-1.5 text-xs text-primary-foreground/70">
                  Private
                </div>
              </div>
            </div>

            <p className="relative z-10 text-[11px] text-primary-foreground/40">
              © {new Date().getFullYear()} Mini Mall
            </p>
          </div>

          {/* Right reset form */}
          <div className="flex items-center justify-center px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
            <div className="w-full max-w-md">
              {/* Mobile logo */}
              <div className="mb-7 lg:hidden">
                <Link
                  href="/"
                  className="inline-flex items-center gap-3"
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
              <div className="mb-6">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Account security
                </p>

                <h1 className="text-2xl font-semibold tracking-tight">
                  Set a new password
                </h1>

                <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
                  Choose a new password for your account.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                noValidate
              >
                {/* New password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password">New password</Label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your new password"
                      className="h-10 pl-10"
                    />
                  </div>

                  {/* Password requirements */}
                  <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1">
                    {PASSWORD_CHECKS.map((check) => {
                      const met = check.test(password);

                      return (
                        <li
                          key={check.label}
                          className={`flex items-center gap-1.5 text-[11px] ${
                            met
                              ? "text-success"
                              : "text-muted-foreground"
                          }`}
                        >
                          {met ? (
                            <Check className="h-3 w-3 shrink-0" />
                          ) : (
                            <Circle className="h-3 w-3 shrink-0" />
                          )}

                          <span>{check.label}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">
                    Confirm new password
                  </Label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Confirm your new password"
                      className="h-10 pl-10"
                    />
                  </div>

                  {confirmPassword.length > 0 && (
                    <p
                      className={`text-[11px] ${
                        passwordsMatch
                          ? "text-success"
                          : "text-destructive"
                      }`}
                    >
                      {passwordsMatch
                        ? "Passwords match."
                        : "Passwords do not match."}
                    </p>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div
                    className="rounded-lg border border-destructive/20 bg-destructive/5 p-3"
                    role="alert"
                  >
                    <p className="text-xs leading-5 text-destructive">
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  className="h-10 w-full"
                  disabled={loading}
                >
                  {loading ? (
                    "Updating…"
                  ) : (
                    <>
                      Update password
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-5 text-center text-[11px] leading-4 text-muted-foreground/70">
                After updating your password, you&apos;ll be asked to sign in
                again.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}