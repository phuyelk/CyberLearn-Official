export interface ScanSignal {
  id: string;
  label: string;
  description: string;
  passed: boolean;
  weight: number;
  category: "security" | "trust" | "structure";
}

export interface ScanResult {
  score: number;
  signals: ScanSignal[];
  verdict: "Safe" | "Caution" | "Dangerous";
  verdictDescription: string;
}

const SUSPICIOUS_TLDS = [
  ".xyz", ".tk", ".ml", ".ga", ".cf", ".gq", ".top", ".buzz",
  ".club", ".work", ".click", ".link", ".icu", ".monster",
];

const MALICIOUS_KEYWORDS = [
  "login", "verify", "account", "update", "secure", "confirm",
  "banking", "password", "credential", "suspend", "urgent",
  "alert", "free", "winner", "prize", "congratulations",
  "limited", "expire", "wallet", "paypal", "signin",
];

const TRUSTED_DOMAINS = [
  "google.com", "github.com", "microsoft.com", "apple.com",
  "amazon.com", "facebook.com", "twitter.com", "linkedin.com",
  "wikipedia.org", "stackoverflow.com", "youtube.com", "reddit.com",
  "netflix.com", "spotify.com", "dropbox.com",
];

function extractDomain(url: string): string {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.toLowerCase();
  } catch {
    return url.toLowerCase().split("/")[0] ?? "";
  }
}

function extractFullUrl(url: string): string {
  return (url.startsWith("http") ? url : `https://${url}`).toLowerCase();
}

export function scanWebsite(url: string): ScanResult {
  const domain = extractDomain(url);
  const fullUrl = extractFullUrl(url);
  const domainParts = domain.split(".");
  const baseDomain = domainParts.slice(-2).join(".");

  const signals: ScanSignal[] = [];

  // HTTPS check
  const hasHttps = fullUrl.startsWith("https://");
  signals.push({
    id: "https",
    label: "HTTPS Encryption",
    description: hasHttps
      ? "This site uses HTTPS, meaning data is encrypted in transit."
      : "No HTTPS detected. Data sent to this site may be intercepted.",
    passed: hasHttps,
    weight: 20,
    category: "security",
  });

  // Suspicious TLD
  const hasSuspiciousTld = SUSPICIOUS_TLDS.some((tld) => domain.endsWith(tld));
  signals.push({
    id: "tld",
    label: "Domain Extension",
    description: hasSuspiciousTld
      ? `Uses a suspicious TLD commonly associated with malicious sites.`
      : "Domain extension appears standard and trustworthy.",
    passed: !hasSuspiciousTld,
    weight: 15,
    category: "trust",
  });

  // Malicious keywords in domain
  const domainBase = domain.replace(/\.[^.]+$/, "").replace(/^www\./, "");
  const foundKeywords = MALICIOUS_KEYWORDS.filter((kw) => domainBase.includes(kw));
  signals.push({
    id: "keywords",
    label: "Suspicious Keywords",
    description: foundKeywords.length > 0
      ? `Found suspicious keywords in domain: ${foundKeywords.join(", ")}. These are commonly used in phishing.`
      : "No suspicious keywords detected in the domain name.",
    passed: foundKeywords.length === 0,
    weight: 15,
    category: "trust",
  });

  // Subdomain depth
  const subdomainDepth = domainParts.length;
  const tooManySubdomains = subdomainDepth > 4;
  signals.push({
    id: "subdomains",
    label: "Subdomain Depth",
    description: tooManySubdomains
      ? `${subdomainDepth} levels of subdomains detected. Excessive nesting can indicate domain obfuscation.`
      : "Subdomain structure looks normal.",
    passed: !tooManySubdomains,
    weight: 10,
    category: "structure",
  });

  // Domain pattern (numbers and hyphens)
  const hasNumbers = /\d/.test(domainBase);
  const excessiveHyphens = (domainBase.match(/-/g) ?? []).length > 2;
  const suspiciousPattern = hasNumbers && excessiveHyphens;
  signals.push({
    id: "pattern",
    label: "Domain Pattern",
    description: suspiciousPattern
      ? "Domain contains both numbers and excessive hyphens, a common pattern in malicious domains."
      : "Domain naming pattern appears legitimate.",
    passed: !suspiciousPattern,
    weight: 10,
    category: "structure",
  });

  // URL length
  const isLongUrl = url.length > 100;
  signals.push({
    id: "length",
    label: "URL Length",
    description: isLongUrl
      ? `URL is ${url.length} characters long. Excessively long URLs can hide the true destination.`
      : `URL length (${url.length} chars) is within normal range.`,
    passed: !isLongUrl,
    weight: 8,
    category: "structure",
  });

  // @ symbol in URL (credential harvesting indicator)
  const hasAtSymbol = fullUrl.includes("@");
  signals.push({
    id: "at-symbol",
    label: "Credential Injection",
    description: hasAtSymbol
      ? 'URL contains an "@" symbol, which can be used to disguise the true destination.'
      : "No credential injection patterns detected.",
    passed: !hasAtSymbol,
    weight: 15,
    category: "security",
  });

  // URL encoding / obfuscation
  const encodingCount = (fullUrl.match(/%[0-9a-f]{2}/gi) ?? []).length;
  const excessiveEncoding = encodingCount > 3;
  signals.push({
    id: "encoding",
    label: "URL Obfuscation",
    description: excessiveEncoding
      ? `${encodingCount} encoded characters detected. Excessive encoding can hide malicious content.`
      : "No suspicious URL encoding detected.",
    passed: !excessiveEncoding,
    weight: 10,
    category: "security",
  });

  // IP address as domain
  const isIpDomain = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain);
  signals.push({
    id: "ip-domain",
    label: "IP-Based URL",
    description: isIpDomain
      ? "Uses a raw IP address instead of a domain name. Legitimate sites rarely do this."
      : "Uses a proper domain name.",
    passed: !isIpDomain,
    weight: 12,
    category: "trust",
  });

  // Known trusted domain check
  const isTrusted = TRUSTED_DOMAINS.some((td) => baseDomain === td || domain.endsWith("." + td));
  if (isTrusted) {
    signals.push({
      id: "trusted",
      label: "Known Trusted Domain",
      description: "This domain is recognized as a major trusted website.",
      passed: true,
      weight: 0,
      category: "trust",
    });
  }

  // Calculate score
  let riskScore = signals.reduce((sum, s) => sum + (s.passed ? 0 : s.weight), 0);
  if (isTrusted) riskScore = Math.max(0, riskScore - 30);
  riskScore = Math.min(100, Math.max(0, riskScore));

  let verdict: ScanResult["verdict"];
  let verdictDescription: string;

  if (riskScore < 25) {
    verdict = "Safe";
    verdictDescription = "This website appears to be safe. No significant risk indicators were found.";
  } else if (riskScore < 55) {
    verdict = "Caution";
    verdictDescription = "Some risk indicators were found. Proceed with caution and avoid entering sensitive information.";
  } else {
    verdict = "Dangerous";
    verdictDescription = "Multiple risk indicators detected. This website may be malicious. Do not enter any personal information.";
  }

  return { score: riskScore, signals, verdict, verdictDescription };
}
