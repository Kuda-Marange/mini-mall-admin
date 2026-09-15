"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail, ShoppingBag } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    // Always show the same message whether or not the email exists.
    setSent(true);
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl items-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-border/60 bg-background shadow-sm lg:grid-cols-2">
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
                Account recovery
              </p>

              <h1 className="text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
                Get back to managing your store.
              </h1>

              <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/65">
                Reset your password securely and get back to your Mini Mall
                dashboard.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <div className="rounded-full border border-primary-foreground/10 bg-primary-foreground/5 px-3 py-1.5 text-xs text-primary-foreground/70">
                  Secure
                </div>

                <div className="rounded-full border border-primary-foreground/10 bg-primary-foreground/5 px-3 py-1.5 text-xs text-primary-foreground/70">
                  Private
                </div>

                <div className="rounded-full border border-primary-foreground/10 bg-primary-foreground/5 px-3 py-1.5 text-xs text-primary-foreground/70">
                  Protected
                </div>
              </div>
            </div>

            <p className="relative z-10 text-[11px] text-primary-foreground/40">
              © {new Date().getFullYear()} Mini Mall
            </p>
          </div>

          {/* Right panel */}
          <div className="flex items-center justify-center px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-10">
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

              {!sent ? (
                <>
                  {/* Heading */}
                  <div className="mb-6">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      Account recovery
                    </p>

                    <h2 className="text-2xl font-semibold tracking-tight">
                      Forgot your password?
                    </h2>

                    <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
                      Enter your email and we&apos;ll send you a secure reset
                      link.
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    noValidate
                  >
                    {/* Email */}
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email address</Label>

                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="h-10 pl-10 text-sm placeholder:text-xs"
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      className="h-10 w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        "Sending…"
                      ) : (
                        <>
                          Send reset link
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                /* Confirmation */
                <div>
                  <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-success/10">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>

                  <div className="mb-6">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      Check your inbox
                    </p>

                    <h2 className="text-2xl font-semibold tracking-tight">
                      Reset link sent
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      If that email has an account, a password reset link has
                      been sent. Check your inbox and follow the instructions.
                    </p>
                  </div>

                  <div className="rounded-lg border border-success/20 bg-success/10 p-3">
                    <p className="text-xs leading-5 text-success">
                      For security reasons, we show the same message whether
                      or not an account exists for that email address.
                    </p>
                  </div>
                </div>
              )}

              {/* Back to login */}
              <p className="mt-6 text-center text-xs text-muted-foreground">
                <Link
                  href="/login"
                  className="font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  Back to sign in
                </Link>
              </p>

              {/* Security note */}
              <p className="mt-5 text-center text-[11px] leading-4 text-muted-foreground/70">
                Your account recovery is securely handled through Supabase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
