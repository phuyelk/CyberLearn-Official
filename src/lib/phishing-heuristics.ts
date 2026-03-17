const KNOWN_BRANDS = [
  "google","facebook","amazon","apple","microsoft","netflix","paypal",
  "instagram","twitter","linkedin","dropbox","spotify","github","yahoo",
  "ebay","chase","wellsfargo","bankofamerica","citibank","outlook",
];

const SUSPICIOUS_KEYWORDS = [
  "login","verify","account","update","secure","confirm","banking",
  "password","credential","suspend","urgent","alert","click","free",
  "winner","prize","congratulations","limited","expire",
];

export interface PhishingSignal { id: string; label: string; description: string; passed: boolean; weight: number }
export interface PhishingResult { score: number; signals: PhishingSignal[]; riskLevel: "low" | "medium" | "high" }

function levenshtein(a: string, b: string): number {
  const m: number[][] = [];
  for (let i = 0; i <= b.length; i++) m[i] = [i];
  for (let j = 0; j <= a.length; j++) m[0]![j] = j;
  for (let i = 1; i <= b.length; i++)
    for (let j = 1; j <= a.length; j++)
      m[i]![j] = b[i - 1] === a[j - 1] ? m[i - 1]![j - 1]! : Math.min(m[i - 1]![j - 1]! + 1, m[i]![j - 1]! + 1, m[i - 1]![j]! + 1);
  return m[b.length]![a.length]!;
}

function extractDomain(url: string): string {
  try { return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.toLowerCase(); }
  catch { return url.toLowerCase().split("/")[0] ?? ""; }
}

export function analyzeUrl(url: string): PhishingResult {
  const domain = extractDomain(url);
  const fullUrl = url.toLowerCase();
  const domainBase = domain.replace(/\.(com|net|org|io|co|xyz|info|biz).*$/, "").replace(/^www\./, "");

  const hasHttps = fullUrl.startsWith("https://") || fullUrl.startsWith("https");
  const httpsSignal: PhishingSignal = { id: "https", label: "HTTPS Present", description: hasHttps ? "This URL uses HTTPS, which encrypts the connection." : "No HTTPS. Data sent to this site is not encrypted.", passed: hasHttps, weight: 15 };

  const foundKw = SUSPICIOUS_KEYWORDS.filter((kw) => domain.includes(kw));
  const keywordSignal: PhishingSignal = { id: "keywords", label: "Suspicious Keywords", description: foundKw.length > 0 ? `Found suspicious keywords in domain: ${foundKw.join(", ")}.` : "No suspicious keywords in domain.", passed: foundKw.length === 0, weight: 20 };

  let isLookalike = false, lookalikeBrand = "";
  for (const brand of KNOWN_BRANDS) {
    if (domainBase !== brand && domainBase.includes(brand.slice(0, 4))) {
      const dist = levenshtein(domainBase, brand);
      if (dist > 0 && dist <= 3) { isLookalike = true; lookalikeBrand = brand; break; }
    }
  }
  const lookalikeSignal: PhishingSignal = { id: "lookalike", label: "Lookalike Domain", description: isLookalike ? `Looks similar to "${lookalikeBrand}" but isn't official. Common phishing technique.` : "No resemblance to known brand names.", passed: !isLookalike, weight: 25 };

  const isLongUrl = url.length > 75;
  const lengthSignal: PhishingSignal = { id: "length", label: "URL Length", description: isLongUrl ? `URL is ${url.length} chars. Long URLs can hide the true destination.` : `URL length (${url.length}) is normal.`, passed: !isLongUrl, weight: 10 };

  const hasSubdomains = domain.split(".").length > 3;
  const redirectSignal: PhishingSignal = { id: "redirects", label: "Redirect Chains", description: hasSubdomains ? "Multiple subdomains detected — can indicate domain obfuscation." : "No unusual subdomain nesting.", passed: !hasSubdomains, weight: 15 };

  const hasNumbers = /\d/.test(domainBase);
  const hasHyphens = domainBase.split("-").length > 2;
  const suspiciousDomain = hasNumbers || hasHyphens;
  const domainAgeSignal: PhishingSignal = { id: "domain-age", label: "Domain Pattern", description: suspiciousDomain ? "Domain contains unusual patterns (numbers, excessive hyphens) common in phishing." : "Domain naming pattern appears typical.", passed: !suspiciousDomain, weight: 15 };

  const signals = [httpsSignal, keywordSignal, lookalikeSignal, lengthSignal, redirectSignal, domainAgeSignal];
  let riskScore = signals.reduce((sum, s) => sum + (s.passed ? 0 : s.weight), 0);
  riskScore = Math.min(100, Math.max(0, riskScore));
  const riskLevel: "low" | "medium" | "high" = riskScore < 40 ? "low" : riskScore < 70 ? "medium" : "high";

  return { score: riskScore, signals, riskLevel };
}
