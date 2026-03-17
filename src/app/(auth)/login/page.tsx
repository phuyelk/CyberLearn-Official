"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Try demo@cyberlearn.dev / password123");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-[400px] p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <Shield size={24} className="text-accent" />
          <span className="font-heading font-semibold text-[20px] tracking-tight">
            CyberLearn
          </span>
        </div>

        <h1 className="font-heading font-medium text-[18px] mb-1">Welcome back</h1>
        <p className="text-text-secondary text-[14px] mb-6">
          Sign in to continue your learning journey.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] text-text-secondary mb-1.5">Email</label>
            <Input
              type="email"
              placeholder="demo@cyberlearn.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[13px] text-text-secondary mb-1.5">Password</label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-[13px] text-danger">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-[13px] text-text-muted mt-4 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-accent hover:underline">
            Create one
          </Link>
        </p>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-[12px] text-text-muted text-center">
            Demo: demo@cyberlearn.dev / password123
          </p>
        </div>
      </Card>
    </div>
  );
}
