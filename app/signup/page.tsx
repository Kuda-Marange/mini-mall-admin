"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Circle,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  ShoppingBag,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PASSWORD_CHECKS: {
  label: string;
  test: (pw: string) => boolean;
}[] = [
  {
    label: "13+ characters",
    test: (pw) => pw.length >= 13,
  },
  {
    label: "Lowercase letter",
    test: (pw) => /[a-z]/.test(pw),
  },
  {
    label: "Uppercase letter",
    test: (pw) => /[A-Z]/.test(pw),
  },
  {
    label: "Number",
    test: (pw) => /[0-9]/.test(pw),
  },
  {
    label: "Symbol",
    test: (pw) => /[^A-Za-z0-9]/.test(pw),
  },
];

const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    email: z.string().email("Enter a valid email address."),
    password: z
      .string()
      .min(13, "Password must be at least 13 characters.")
      .regex(/[a-z]/, "Add a lowercase letter.")
      .regex(/[A-Z]/, "Add an uppercase letter.")
      .regex(/[0-9]/, "Add a number.")
      .regex(/[^A-Za-z0-9]/, "Add a symbol."),
    confirmPassword: z.string(),
    setupCode: z.string().min(1, "Setup code is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showSetupCode, setShowSetupCode] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      setupCode: "",
    },
  });

  const password = watch("password") ?? "";
  const confirmPassword = watch("confirmPassword") ?? "";

  const passedChecks = PASSWORD_CHECKS.filter((check) =>
    check.test(password)
  ).length;

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  async function onSubmit(values: SignupFormValues) {
    setServerError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          setupCode: values.setupCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong.");
        return;
      }

      router.push("/login?created=1");
    } catch {
      setServerError(
        "Unable to create your account. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-muted/30 px-3 py-3 sm:px-4 sm:py-4">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-6xl items-center sm:min-h-[calc(100vh-2rem)]">
        <div className="grid w-full overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm lg:grid-cols-2 lg:rounded-[28px]">
          {/* ================= LEFT PANEL ================= */}
          <div className="relative hidden overflow-hidden bg-primary p-8 text-primary-foreground lg:flex lg:min-h-[650px] lg:flex-col lg:justify-between">
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

            {/* Content */}
            <div className="relative z-10 max-w-md">
              <p className="mb-3 text-xs font-medium text-primary-foreground/60">
                Store administration
              </p>

              <h1 className="text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
                Start managing your store today.
              </h1>

              <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/70">
                Create your admin account and manage products, orders,
                customers and your storefront from one place.
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

          {/* ================= FORM PANEL ================= */}
          <div className="flex min-w-0 items-center justify-center px-4 py-6 sm:px-8 sm:py-8 lg:min-h-[650px] lg:px-12">
            <div className="w-full max-w-md">
              {/* Mobile Logo */}
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
                  Create your account
                </h2>

                <p className="mt-1.5 text-xs leading-5 text-muted-foreground sm:text-sm">
                  Create an admin account to manage your Mini Mall store.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-3.5"
                noValidate
              >
                {/* First + Last Name */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="min-w-0 space-y-1.5">
                    <Label htmlFor="firstName" className="text-xs">
                      First name
                    </Label>

                    <div className="relative">
                      <User className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        id="firstName"
                        autoComplete="given-name"
                        placeholder="First name"
                        className="h-9 min-w-0 pl-8 text-sm placeholder:text-xs"
                        {...register("firstName")}
                      />
                    </div>

                    {errors.firstName && (
                      <p className="text-[11px] text-destructive">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="min-w-0 space-y-1.5">
                    <Label htmlFor="lastName" className="text-xs">
                      Last name
                    </Label>

                    <div className="relative">
                      <User className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        id="lastName"
                        autoComplete="family-name"
                        placeholder="Last name"
                        className="h-9 min-w-0 pl-8 text-sm placeholder:text-xs"
                        {...register("lastName")}
                      />
                    </div>

                    {errors.lastName && (
                      <p className="text-[11px] text-destructive">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

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
                      placeholder="you@example.com"
                      className="h-9 pl-8 text-sm placeholder:text-xs"
                      {...register("email")}
                    />
                  </div>

                  {errors.email && (
                    <p className="text-[11px] text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs">
                    Password
                  </Label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create a strong password"
                      className="h-9 pl-8 pr-9 text-sm placeholder:text-xs"
                      {...register("password")}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Password strength */}
                  <div className="flex gap-1 pt-0.5">
                    {PASSWORD_CHECKS.map((check) => (
                      <div
                        key={check.label}
                        className={`h-1 flex-1 rounded-full ${
                          check.test(password)
                            ? "bg-primary"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Password requirements */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1">
                    {PASSWORD_CHECKS.map((check) => {
                      const passed = check.test(password);

                      return (
                        <div
                          key={check.label}
                          className={`flex min-w-0 items-center gap-1 text-[10px] leading-4 ${
                            passed
                              ? "text-success"
                              : "text-muted-foreground"
                          }`}
                        >
                          {passed ? (
                            <Check className="h-2.5 w-2.5 shrink-0" />
                          ) : (
                            <Circle className="h-2.5 w-2.5 shrink-0" />
                          )}

                          <span className="truncate">
                            {check.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {errors.password && (
                    <p className="text-[11px] text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-xs">
                    Confirm password
                  </Label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      className={`h-9 pl-8 text-sm placeholder:text-xs ${
                        passwordsMatch
                          ? "border-success focus-visible:ring-success"
                          : ""
                      }`}
                      {...register("confirmPassword")}
                    />
                  </div>

                  {errors.confirmPassword && (
                    <p className="text-[11px] text-destructive">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Setup Code */}
                <div className="space-y-1.5">
                  <Label htmlFor="setupCode" className="text-xs">
                    Admin setup code
                  </Label>

                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="setupCode"
                      type={showSetupCode ? "text" : "password"}
                      autoComplete="off"
                      placeholder="Enter setup code"
                      className="h-9 pl-8 pr-9 text-sm placeholder:text-xs"
                      {...register("setupCode")}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowSetupCode((value) => !value)
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={
                        showSetupCode
                          ? "Hide setup code"
                          : "Show setup code"
                      }
                    >
                      {showSetupCode ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {errors.setupCode && (
                    <p className="text-[11px] text-destructive">
                      {errors.setupCode.message}
                    </p>
                  )}
                </div>

                {/* Server Error */}
                {serverError && (
                  <div
                    className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-xs leading-5 text-destructive"
                    role="alert"
                  >
                    {serverError}
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  className="h-10 w-full text-sm"
                  disabled={loading || passedChecks !== 5}
                >
                  {loading ? (
                    "Creating account..."
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Login Link */}
              <p className="mt-5 text-center text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-foreground underline underline-offset-4 hover:opacity-70"
                >
                  Sign in
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