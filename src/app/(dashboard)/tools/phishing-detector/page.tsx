"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Callout } from "@/components/ui/callout";
import { ArcGauge } from "@/components/features/arc-gauge";
import { analyzeUrl, type PhishingResult } from "@/lib/phishing-heuristics";
import { CheckCircle2, XCircle, ClipboardPaste, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PhishingDetectorPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<PhishingResult | null>(null);

  const handleAnalyze = () => {
    if (!url.trim()) return;
    setResult(analyzeUrl(url.trim()));
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch { /* clipboard not available */ }
  };

  return (
    <div className="min-h-screen">
      <Topbar title="Phishing URL Detector" breadcrumbs={[{ label: "Tools" }]} />
      <div className="max-w-content mx-auto px-8 py-8">
        <p className="text-text-secondary text-body mb-6 max-w-2xl">
          Paste any URL to check it for common phishing indicators. This tool analyzes the URL structure
          to identify red flags — it doesn&apos;t visit the actual website.
        </p>

        <Card className="mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Input
                placeholder="https://example.com/verify-account"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              />
              <button onClick={handlePaste}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-badge text-text-muted hover:text-text-primary transition-colors"
                title="Paste from clipboard">
                <ClipboardPaste size={14} />
              </button>
            </div>
            <Button onClick={handleAnalyze} disabled={!url.trim()}>Analyze</Button>
          </div>
        </Card>

        {result && (
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <div className="flex justify-center py-4">
                <ArcGauge value={result.score} />
              </div>
            </Card>

            <Card>
              <h3 className="font-heading font-medium text-[15px] mb-4">Signals Checked</h3>
              <div className="space-y-3">
                {result.signals.map((signal) => (
                  <div key={signal.id} className="flex items-start gap-3">
                    {signal.passed
                      ? <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                      : <XCircle size={16} className="text-danger shrink-0 mt-0.5" />}
                    <div>
                      <p className="text-[13px] font-medium text-text-primary">{signal.label}</p>
                      <p className="text-[12px] text-text-secondary">{signal.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="col-span-2">
              <Callout variant={result.riskLevel === "high" ? "warning" : "info"}
                title={result.riskLevel === "high" ? "What to do if you received this link" : "Looks reasonable"}>
                {result.riskLevel === "high"
                  ? "Do not click the link. If this was in an email, report it as phishing. If you already clicked it, change any passwords you may have entered and enable 2FA."
                  : result.riskLevel === "medium"
                  ? "Some indicators are concerning. Proceed with caution and verify the URL through official channels before entering any personal information."
                  : "This URL doesn't show obvious phishing patterns, but always stay cautious. When in doubt, navigate to websites directly instead of clicking links."}
              </Callout>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-border">
          <Link href="/learn/how-phishing-works" className="inline-flex items-center gap-2 text-[14px] text-accent hover:underline">
            Learn more about Phishing <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
