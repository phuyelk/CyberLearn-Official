"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArcGauge } from "@/components/features/arc-gauge";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { analyzeIP, getPublicIP, type IPResult } from "@/lib/ip-utils";
import {
  Globe, MapPin, Building2, Shield, Wifi, Clock,
  Search, Crosshair, AlertTriangle, CheckCircle2, Info,
} from "lucide-react";

export default function IPIntelPage() {
  const [ip, setIp] = useState("");
  const [result, setResult] = useState<IPResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLookup() {
    if (!ip.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeIP(ip.trim());
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Failed to analyze IP address");
    } finally {
      setLoading(false);
    }
  }

  async function handleDetectMyIP() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const myIp = await getPublicIP();
      setIp(myIp);
      const data = await analyzeIP(myIp);
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Failed to detect your IP");
    } finally {
      setLoading(false);
    }
  }

  const severityIcon = {
    info: <Info size={14} className="text-accent" />,
    warning: <AlertTriangle size={14} className="text-warning" />,
    danger: <AlertTriangle size={14} className="text-danger" />,
  };

  const severityVariant = {
    info: "accent" as const,
    warning: "warning" as const,
    danger: "danger" as const,
  };

  const threatColor = {
    Low: "text-success",
    Medium: "text-warning",
    High: "text-danger",
    Critical: "text-danger",
  };

  return (
    <div className="min-h-screen">
      <Topbar title="IP Intelligence" />
      <div className="max-w-content mx-auto px-8 py-8">
        <FadeIn>
          <h1 className="text-[28px] font-heading font-bold text-text-primary tracking-tight mb-1">
            IP Address Intelligence
          </h1>
          <p className="text-text-secondary text-[15px] mb-8">
            Analyze any IP address for geolocation, ISP details, and threat reputation.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <Card className="mb-8">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                  placeholder="Enter an IP address (e.g. 8.8.8.8)"
                  className="w-full h-10 pl-10 pr-4 bg-bg-elevated border border-border rounded-input text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus transition-colors"
                />
              </div>
              <Button onClick={handleLookup} disabled={loading || !ip.trim()}>
                {loading ? "Analyzing..." : "Lookup"}
              </Button>
              <Button variant="secondary" onClick={handleDetectMyIP} disabled={loading}>
                <Crosshair size={14} />
                My IP
              </Button>
            </div>
            {error && (
              <div className="mt-3 flex items-center gap-2 text-danger text-[13px]">
                <AlertTriangle size={14} />
                {error}
              </div>
            )}
          </Card>
        </FadeIn>

        {result && (
          <StaggerContainer className="space-y-6" staggerDelay={0.1}>
            <StaggerItem>
              <div className="grid grid-cols-3 gap-6">
                <Card className="col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin size={16} className="text-accent" />
                    <h2 className="font-heading font-medium text-[15px]">Location</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoRow label="IP Address" value={result.ip} />
                    <InfoRow label="Country" value={`${result.country} (${result.countryCode})`} />
                    <InfoRow label="Region" value={result.region} />
                    <InfoRow label="City" value={result.city} />
                    <InfoRow label="ZIP Code" value={result.zip} />
                    <InfoRow label="Coordinates" value={`${result.lat.toFixed(4)}, ${result.lon.toFixed(4)}`} />
                  </div>
                </Card>

                <Card>
                  <div className="flex flex-col items-center">
                    <h2 className="font-heading font-medium text-[15px] mb-4 self-start flex items-center gap-2">
                      <Shield size={16} className="text-accent" />
                      Threat Score
                    </h2>
                    <ArcGauge value={result.threatScore} />
                    <Badge
                      variant={result.threatScore >= 40 ? "danger" : result.threatScore >= 20 ? "warning" : "success"}
                      className="mt-2"
                    >
                      {result.threatLevel} Risk
                    </Badge>
                  </div>
                </Card>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 size={16} className="text-accent" />
                    <h2 className="font-heading font-medium text-[15px]">Network Details</h2>
                  </div>
                  <div className="space-y-3">
                    <InfoRow label="ISP" value={result.isp} />
                    <InfoRow label="Organization" value={result.org} />
                    <InfoRow label="AS Number" value={result.as} />
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={16} className="text-accent" />
                    <h2 className="font-heading font-medium text-[15px]">Additional Info</h2>
                  </div>
                  <div className="space-y-3">
                    <InfoRow label="Timezone" value={result.timezone} />
                    <InfoRow label="Connection Type" value={
                      result.mobile ? "Mobile" : result.hosting ? "Data Center" : "Residential/Business"
                    } />
                    <InfoRow label="Proxy / VPN" value={result.proxy ? "Yes" : "No"} />
                  </div>
                </Card>
              </div>
            </StaggerItem>

            <StaggerItem>
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={16} className="text-accent" />
                  <h2 className="font-heading font-medium text-[15px]">Threat Assessment</h2>
                </div>
                <div className="space-y-3">
                  {result.signals.map((signal, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-input bg-bg-elevated"
                    >
                      <div className="mt-0.5">{severityIcon[signal.severity]}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[14px] font-medium text-text-primary">{signal.label}</span>
                          <Badge variant={severityVariant[signal.severity]}>{signal.severity}</Badge>
                        </div>
                        <p className="text-[13px] text-text-secondary">{signal.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Globe size={16} className="text-accent" />
                  <h2 className="font-heading font-medium text-[15px]">Location Map</h2>
                </div>
                <div className="relative w-full h-[240px] bg-bg-elevated rounded-input overflow-hidden flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={32} className="text-accent mx-auto mb-2" />
                    <p className="text-[15px] font-medium text-text-primary">{result.city}, {result.region}</p>
                    <p className="text-[13px] text-text-secondary">{result.country}</p>
                    <p className="text-[12px] text-text-muted mt-1 font-mono">
                      {result.lat.toFixed(4)}°N, {result.lon.toFixed(4)}°E
                    </p>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted mb-0.5">{label}</p>
      <p className="text-[14px] text-text-primary">{value}</p>
    </div>
  );
}
