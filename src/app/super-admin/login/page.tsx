"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [sent, setSent] = React.useState(false);

  // Check if already logged in as super admin
  React.useEffect(() => {
    fetch("/api/super-admin/auth/check")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) router.push("/super-admin");
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Use the existing magic link auth
      const res = await fetch("/api/auth/magic-link/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to send magic link");
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-500/10 rounded-xl w-fit">
            <Shield className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle className="text-xl text-white">
            Super Admin Access
          </CardTitle>
          <p className="text-sm text-slate-400 mt-1">
            Restricted area. Only authorized platform administrators.
          </p>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4">
              <div className="mx-auto p-3 bg-green-500/10 rounded-xl w-fit">
                <Mail className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">Magic link sent!</p>
                <p className="text-sm text-slate-400 mt-1">
                  Check your email at{" "}
                  <strong className="text-slate-300">{email}</strong> and click
                  the link to sign in.
                </p>
              </div>
              <Button
                variant="ghost"
                className="text-slate-400"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
              >
                Use different email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-slate-400 block mb-1.5">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
                  required
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Send Magic Link
                  </>
                )}
              </Button>
              <p className="text-xs text-slate-500 text-center">
                Only users with isSuperAdmin access can sign in here.
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
