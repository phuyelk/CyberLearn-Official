"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/ui/callout";
import { ArcGauge } from "@/components/features/arc-gauge";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { scanWebsite, type ScanResult } from "@/lib/website-scanner";
import {
  ScanSearch, ClipboardPaste, CheckCircle2, XCircle, Shield,
  ArrowRight, AlertTriangle, Globe,
} from "lucide-react";
import Link from "next/link";

const categoryLabels = {
  security: "Security",
  trust: "Trust",
  structure: "Structure",
};

const verdictStyles = {
  Safe: "success" as const,
  Caution: "warning" as const,
  Dangerous: "danger" as const,
};

export default function WebsiteScannerPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);

  function handleScan() {
    if (!url.trim()) return;
    setResult(scanWebsite(url.trim()));
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch { /* clipboard not available */ }
  }

  const passedCount = result?.signals.filter((s) => s.passed).length ?? 0;
  const failedCount = result?.signals.filter((s) => !s.passed).length ?? 0;

  return (
    <div className="min-h-screen">
      <Topbar title="Website Scanner" breadcrumbs={[{ label: "Tools" }]} />
      <div className="max-w-content mx-auto px-8 py-8">
        <FadeIn>
          <h1 className="text-[28px] font-heading font-bold text-text-primary tracking-tight mb-1">
            Website Scanner
          </h1>
          <p className="text-text-secondary text-[15px] mb-8 max-w-2xl">
            Enter any URL to analyze it for security risks. We check for HTTPS, suspicious patterns,
            domain reputation, and other threat indicators.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Card className="mb-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <ScanSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleScan()}
                  placeholder="https://example.com"
                  className="w-full h-10 pl-10 pr-10 bg-bg-elevated border border-border rounded-input text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus transition-colors"
                />
                <button
                  onClick={handlePaste}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-badge text-text-muted hover:text-text-primary transition-colors"
                  title="Paste from clipboard"
                >
                  <ClipboardPaste size={14} />
                </button>
              </div>
              <Button onClick={handleScan} disabled={!url.trim()}>
                <ScanSearch size={14} />
                Scan
              </Button>
            </div>
          </Card>
        </FadeIn>

        {result && (
          <StaggerContainer className="space-y-6" staggerDelay={0.1}>
            <StaggerItem>
              <div className="grid grid-cols-3 gap-6">
                <Card>
                  <div className="flex flex-col items-center py-2">
                    <ArcGauge value={result.score} />
                    <Badge variant={verdictStyles[result.verdict]} className="mt-2 text-[12px]">
                      {result.verdict}
                    </Badge>
                  </div>
                </Card>

                <Card className="col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield size={16} className="text-accent" />
                    <h2 className="font-heading font-medium text-[15px]">Scan Summary</h2>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-bg-elevated rounded-input">
                      <p className="text-[22px] font-heading font-semibold text-text-primary">{result.signals.length}</p>
                      <p className="text-[12px] text-text-muted">Checks Run</p>
                    </div>
                    <div className="text-center p-3 bg-success/10 rounded-input">
                      <p className="text-[22px] font-heading font-semibold text-success">{passedCount}</p>
                      <p className="text-[12px] text-text-muted">Passed</p>
                    </div>
                    <div className="text-center p-3 bg-danger/10 rounded-input">
                      <p className="text-[22px] font-heading font-semibold text-danger">{failedCount}</p>
                      <p className="text-[12px] text-text-muted">Failed</p>
                    </div>
                  </div>

                  <p className="text-[13px] text-text-secondary">{result.verdictDescription}</p>
                </Card>
              </div>
            </StaggerItem>

            <StaggerItem>
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Globe size={16} className="text-accent" />
                  <h2 className="font-heading font-medium text-[15px]">Detailed Signals</h2>
                </div>
                <div className="space-y-3">
                  {result.signals.map((signal) => (
                    <div key={signal.id} className="flex items-start gap-3 p-3 rounded-input bg-bg-elevated">
                      {signal.passed
                        ? <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                        : <XCircle size={16} className="text-danger shrink-0 mt-0.5" />}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[13px] font-medium text-text-primary">{signal.label}</span>
                          <Badge variant={signal.passed ? "success" : "danger"} className="text-[10px]">
                            {categoryLabels[signal.category]}
                          </Badge>
                        </div>
                        <p className="text-[12px] text-text-secondary">{signal.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Callout
                variant={result.verdict === "Safe" ? "info" : "warning"}
                title={result.verdict === "Dangerous" ? "Warning: High Risk Detected" : result.verdict === "Caution" ? "Proceed with Caution" : "Looking Good"}
              >
                {result.verdict === "Dangerous"
                  ? "This URL shows multiple red flags. Do NOT enter passwords, personal info, or financial data. If you received this link via email or message, report it as phishing."
                  : result.verdict === "Caution"
                  ? "Some indicators suggest this URL may not be fully trustworthy. Double-check the domain, avoid entering sensitive data, and verify the link source."
                  : "This URL passed most security checks. Standard internet safety practices still apply — verify the sender if the link was unexpected."}
              </Callout>
            </StaggerItem>

            <StaggerItem>
              <div className="pt-2 border-t border-border">
                <Link href="/learn/how-phishing-works" className="inline-flex items-center gap-2 text-[14px] text-accent hover:underline">
                  Learn more about identifying malicious URLs <ArrowRight size={14} />
                </Link>
              </div>
            </StaggerItem>
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}
