"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Sparkles, CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { signIn } from "@/lib/auth/client";

// Check if demo mode is enabled (set via env variable exposed to client)
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [magicLinkSent, setMagicLinkSent] = React.useState(false);
  const [error, setError] = React.useState("");
  const [authMode, setAuthMode] = React.useState<"password" | "magic-link">("magic-link");

  // Handle demo login
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
    } catch (err) {
      setError("Failed to connect. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email/password login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const result = await signIn.email({
        email,
        password,
      });
      
      if (result.error) {
        setError(result.error.message || "Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle magic link login
  const handleMagicLinkLogin = async (e: React.FormEvent) => {
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
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      setError("Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  // Handle GitHub OAuth
  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      await signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      setError("Failed to sign in with GitHub");
      setIsLoading(false);
    }
  };

  const handleSubmit = authMode === "magic-link" ? handleMagicLinkLogin : handlePasswordLogin;

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-text-primary">
            Optimus SEO
          </span>
        </Link>
        <p className="text-text-secondary mt-2">
          Your AI SEO team, on autopilot
        </p>
      </div>

      {/* Demo Mode Banner */}
      {DEMO_MODE && (
        <div className="mb-4 p-4 rounded-lg bg-accent/10 border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-accent" />
            <span className="font-semibold text-text-primary">Demo Mode Active</span>
          </div>
          <p className="text-sm text-text-secondary mb-3">
            Try Optimus SEO instantly without signing up.
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

      <Card>
        <CardContent className="p-6">
          <h1 className="text-xl font-semibold text-text-primary mb-6">
            Sign in to your account
          </h1>

          {/* Magic Link Sent Success State */}
          {magicLinkSent ? (
            <div className="text-center py-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-text-primary mb-2">
                Check your email
              </h2>
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
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Auth Mode Toggle */}
              <div className="flex rounded-lg bg-bg-secondary p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setAuthMode("magic-link")}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    authMode === "magic-link"
                      ? "bg-bg-card text-text-primary shadow-sm"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  Magic Link
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("password")}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    authMode === "password"
                      ? "bg-bg-card text-text-primary shadow-sm"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  Password
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">
                    Email
                  </label>
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

                {authMode === "password" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-text-primary">
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-accent hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="accent"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Please wait..."
                  ) : authMode === "magic-link" ? (
                    <>
                      Send Magic Link
                      <Mail className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </>
          )}

          {!magicLinkSent && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-bg-card px-2 text-text-muted">
                    Or continue with
                  </span>
                </div>
              </div>
            </>
          )}

          {!magicLinkSent && (
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={handleGitHubLogin}
                disabled={isLoading}
              >
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-sm text-text-muted mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-accent hover:underline">
          Sign up for free
        </Link>
      </p>
    </div>
  );
}
