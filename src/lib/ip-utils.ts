export interface IPResult {
  ip: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  isp: string;
  org: string;
  as: string;
  timezone: string;
  zip: string;
  proxy: boolean;
  hosting: boolean;
  mobile: boolean;
  threatScore: number;
  threatLevel: "Low" | "Medium" | "High" | "Critical";
  signals: ThreatSignal[];
}

export interface ThreatSignal {
  label: string;
  description: string;
  severity: "info" | "warning" | "danger";
}

const PRIVATE_RANGES = [
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^127\./,
  /^0\./,
  /^169\.254\./,
];

const BOGON_RANGES = [
  /^100\.(6[4-9]|[7-9]\d|1[0-1]\d|12[0-7])\./,
  /^198\.1[89]\./,
  /^203\.0\.113\./,
  /^198\.51\.100\./,
  /^192\.0\.2\./,
  /^224\./,
  /^240\./,
];

function isPrivateIP(ip: string): boolean {
  return PRIVATE_RANGES.some((r) => r.test(ip));
}

function isBogonIP(ip: string): boolean {
  return BOGON_RANGES.some((r) => r.test(ip));
}

function computeThreatSignals(
  ip: string,
  data: { proxy: boolean; hosting: boolean; mobile: boolean }
): ThreatSignal[] {
  const signals: ThreatSignal[] = [];

  if (isPrivateIP(ip)) {
    signals.push({
      label: "Private IP Range",
      description: "This IP belongs to a private/reserved address range (RFC 1918).",
      severity: "info",
    });
  }

  if (isBogonIP(ip)) {
    signals.push({
      label: "Bogon Address",
      description: "This IP falls within a bogon/unroutable address range.",
      severity: "warning",
    });
  }

  if (data.proxy) {
    signals.push({
      label: "Proxy / VPN / Tor Detected",
      description: "This IP is associated with a proxy, VPN, or Tor exit node.",
      severity: "danger",
    });
  }

  if (data.hosting) {
    signals.push({
      label: "Hosting / Data Center",
      description: "This IP belongs to a hosting provider or data center, not a residential network.",
      severity: "warning",
    });
  }

  if (data.mobile) {
    signals.push({
      label: "Mobile Network",
      description: "This IP is on a mobile/cellular network.",
      severity: "info",
    });
  }

  if (signals.length === 0) {
    signals.push({
      label: "No Threats Detected",
      description: "This IP appears to be a clean residential or business connection.",
      severity: "info",
    });
  }

  return signals;
}

function computeThreatScore(signals: ThreatSignal[]): number {
  let score = 0;
  for (const s of signals) {
    if (s.severity === "danger") score += 40;
    else if (s.severity === "warning") score += 20;
  }
  return Math.min(score, 100);
}

function getThreatLevel(score: number): IPResult["threatLevel"] {
  if (score >= 70) return "Critical";
  if (score >= 40) return "High";
  if (score >= 20) return "Medium";
  return "Low";
}

export async function analyzeIP(ip: string): Promise<IPResult> {
  const res = await fetch(
    `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,proxy,hosting,mobile,query`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch IP data");
  }

  const data = await res.json();

  if (data.status === "fail") {
    throw new Error(data.message || "Invalid IP address");
  }

  const signals = computeThreatSignals(ip, {
    proxy: data.proxy ?? false,
    hosting: data.hosting ?? false,
    mobile: data.mobile ?? false,
  });
  const threatScore = computeThreatScore(signals);

  return {
    ip: data.query,
    city: data.city || "Unknown",
    region: data.regionName || "Unknown",
    country: data.country || "Unknown",
    countryCode: data.countryCode || "??",
    lat: data.lat ?? 0,
    lon: data.lon ?? 0,
    isp: data.isp || "Unknown",
    org: data.org || "Unknown",
    as: data.as || "Unknown",
    timezone: data.timezone || "Unknown",
    zip: data.zip || "N/A",
    proxy: data.proxy ?? false,
    hosting: data.hosting ?? false,
    mobile: data.mobile ?? false,
    threatScore,
    threatLevel: getThreatLevel(threatScore),
    signals,
  };
}

export async function getPublicIP(): Promise<string> {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
}
