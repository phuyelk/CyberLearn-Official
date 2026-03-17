"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Callout } from "@/components/ui/callout";
import { analyzePassword } from "@/lib/password-strength";
import { CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const segmentColors = ["bg-danger", "bg-warning", "bg-warning", "bg-success/70", "bg-success"];
const tips = [
  "Use a passphrase — four or more random words strung together are both strong and memorable.",
  "A password manager generates and stores unique passwords for every account, so you only remember one.",
  "Add 2FA to your important accounts. Even if your password is stolen, attackers can't get in without the second factor.",
];

export default function PasswordAnalyzerPage() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const analysis = analyzePassword(password);

  return (
    <div className="min-h-screen">
      <Topbar title="Password Strength Checker" breadcrumbs={[{ label: "Tools" }]} />
      <div className="max-w-content mx-auto px-8 py-8">
        <p className="text-text-secondary text-body mb-6 max-w-2xl">
          Type a password to see how strong it is. Everything stays in your browser — nothing is sent anywhere.
        </p>

        <div className="max-w-lg">
          <Card className="mb-6">
            <div className="relative mb-4">
              <Input
                type={show ? "text" : "password"}
                placeholder="Type a password to test..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 font-mono"
              />
              <button onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex gap-1.5 mb-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={cn("h-2 flex-1 rounded-full transition-colors duration-panel",
                  password && i <= analysis.score ? segmentColors[analysis.score] : "bg-bg-elevated")} />
              ))}
            </div>
            {password && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-[14px] font-medium" style={{ color: ["#e5484d","#f76b15","#f76b15","#30a46c","#30a46c"][analysis.score] }}>
                  {analysis.label}
                </p>
                {analysis.crackTime && (
                  <p className="text-[12px] text-text-muted">Estimated crack time: {analysis.crackTime}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              {analysis.checks.map((check, i) => (
                <div key={i} className="flex items-center gap-2.5 text-[13px]">
                  {check.passed
                    ? <CheckCircle2 size={14} className="text-success shrink-0" />
                    : <XCircle size={14} className="text-text-muted shrink-0" />}
                  <span className={check.passed ? "text-text-primary" : "text-text-muted"}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="mb-6">
            <h3 className="font-heading font-medium text-[15px] mb-3">Tips for better passwords</h3>
            <div className="space-y-3">
              {tips.map((tip, i) => (
                <p key={i} className="text-[13px] text-text-secondary leading-relaxed">
                  {i + 1}. {tip}
                </p>
              ))}
            </div>
          </Card>

          <Callout variant="info">
            Never submit real passwords to websites you don&apos;t trust. This tool runs entirely in your browser — no data is sent to any server.
          </Callout>
        </div>
      </div>
    </div>
  );
}
