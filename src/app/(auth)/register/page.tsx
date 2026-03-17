"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const register = api.user.register.useMutation({
    async onSuccess() {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (!result?.error) {
        router.push("/dashboard");
        router.refresh();
      }
    },
    onError(err) {
      setError(err.message || "Registration failed. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    register.mutate({ name, email, password });
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

        <h1 className="font-heading font-medium text-[18px] mb-1">Create your account</h1>
        <p className="text-text-secondary text-[14px] mb-6">
          Start learning cybersecurity today.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] text-text-secondary mb-1.5">Name</label>
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[13px] text-text-secondary mb-1.5">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[13px] text-text-secondary mb-1.5">Password</label>
            <Input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <p className="text-[13px] text-danger">{error}</p>}

          <Button type="submit" className="w-full" disabled={register.isPending}>
            {register.isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-[13px] text-text-muted mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
