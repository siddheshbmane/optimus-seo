"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, Sparkles, Check, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { signIn } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

const features = [
  "AI-powered SEO analysis",
  "Automated content generation",
  "Competitor tracking",
  "Unlimited projects",
];

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [magicLinkSent, setMagicLinkSent] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        router.push(data.redirectTo || "/dashboard");
      } else {
        setError(data.error || "Demo login failed");
      }
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn.magicLink({
        email,
        callbackURL: "/dashboard",
      });
      if (result.error) {
        setError(result.error.message || "Failed to send magic link");
      } else {
        setMagicLinkSent(true);
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Side - Features */}
      <div className="hidden lg:flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-text-primary">Optimus SEO</span>
        </div>
        <h2 className="text-3xl font-bold text-text-primary mb-4">
          Your AI SEO team,
          <br />
          <span className="text-accent">on autopilot</span>
        </h2>
        <p className="text-text-secondary mb-8">
          Join thousands of agencies and businesses using AI to automate their SEO operations and
          win more clients.
        </p>
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-success/10 flex items-center justify-center">
                <Check className="h-4 w-4 text-success" />
              </div>
              <span className="text-text-primary">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Side - Form */}
      <div>
        <Card>
          <CardContent className="p-6">
            <div className="lg:hidden text-center mb-6">
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-text-primary">Optimus SEO</span>
              </Link>
            </div>

            {DEMO_MODE && (
              <div className="mb-6 p-4 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-accent" />
                  <span className="font-semibold text-text-primary">Try Demo Mode</span>
                </div>
                <p className="text-sm text-text-secondary mb-3">
                  Skip signup and explore Optimus SEO instantly.
                </p>
                <Button
                  variant="accent"
                  className="w-full"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Enter Demo Mode
                    </>
                  )}
                </Button>
              </div>
            )}

            {magicLinkSent ? (
              <div className="text-center py-6">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-lg font-semibold text-text-primary mb-2">Check your email</h2>
                <p className="text-text-secondary mb-4">
                  We sent a magic link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-text-muted">
                  Click the link in the email to sign in. The link expires in 10 minutes.
                </p>
                <Button
                  variant="ghost"
                  className="mt-4"
                  onClick={() => {
                    setMagicLinkSent(false);
                    setEmail("");
                  }}
                >
                  Use a different email
                </Button>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-semibold text-text-primary mb-2">
                  Create your account
                </h1>
                <p className="text-text-secondary mb-6">
                  Enter your email and we&apos;ll send you a magic link to get started instantly.
                </p>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Work Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="accent" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending..." : (
                      <>
                        Get Started
                        <Mail className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-xs text-text-muted text-center mt-6">
                  By continuing, you agree to our{" "}
                  <Link href="/terms" className="text-accent hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-accent hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
