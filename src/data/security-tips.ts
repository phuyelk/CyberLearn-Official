export interface SecurityTip {
  id: number;
  tip: string;
  category: string;
  learnMoreSlug?: string;
}

export const securityTips: SecurityTip[] = [
  { id: 1, tip: "Use a password manager to generate and store unique passwords for every account.", category: "Passwords", learnMoreSlug: "password-security" },
  { id: 2, tip: "Enable two-factor authentication (2FA) on your email — it protects all your other accounts too.", category: "Authentication", learnMoreSlug: "two-factor-authentication" },
  { id: 3, tip: "Never click links in unexpected emails. Go directly to the website by typing the URL.", category: "Phishing", learnMoreSlug: "how-phishing-works" },
  { id: 4, tip: "Keep your operating system and apps updated. Patches fix known security vulnerabilities.", category: "Basics", learnMoreSlug: "introduction-to-cybersecurity" },
  { id: 5, tip: "Look for HTTPS (the padlock icon) before entering any personal info on a website.", category: "Web Safety", learnMoreSlug: "safe-browsing-habits" },
  { id: 6, tip: "Use different passwords for your work and personal accounts. A breach on one shouldn't compromise the other.", category: "Passwords", learnMoreSlug: "password-security" },
  { id: 7, tip: "Be wary of urgent-sounding messages asking you to \"act now\" — that's a classic social engineering tactic.", category: "Social Engineering", learnMoreSlug: "social-engineering-tactics" },
  { id: 8, tip: "Review app permissions on your phone regularly. Remove access for apps you no longer use.", category: "Mobile Security", learnMoreSlug: "mobile-device-security" },
  { id: 9, tip: "Back up your important files regularly. Ransomware can't hold your data hostage if you have backups.", category: "Data Protection" },
  { id: 10, tip: "Avoid using public Wi-Fi for banking or sensitive tasks without a VPN.", category: "Network Security", learnMoreSlug: "network-security-fundamentals" },
  { id: 11, tip: "Check the sender's actual email address, not just the display name. Spoofing is easy.", category: "Phishing", learnMoreSlug: "how-phishing-works" },
  { id: 12, tip: "Use a secure DNS provider like Cloudflare (1.1.1.1) or Google (8.8.8.8) for extra protection.", category: "Network Security", learnMoreSlug: "network-security-fundamentals" },
  { id: 13, tip: "Lock your devices with a PIN, password, or biometric. An unlocked device is an open invitation.", category: "Basics" },
  { id: 14, tip: "Don't reuse security questions. Treat them like passwords — use random answers stored in your password manager.", category: "Authentication" },
  { id: 15, tip: "If a deal sounds too good to be true online, it almost certainly is. Scammers exploit greed.", category: "Social Engineering", learnMoreSlug: "social-engineering-tactics" },
  { id: 16, tip: "Encrypt sensitive files before sharing them. Even if intercepted, encrypted data is useless to attackers.", category: "Cryptography", learnMoreSlug: "cryptography-essentials" },
  { id: 17, tip: "Regularly check haveibeenpwned.com to see if your email has appeared in data breaches.", category: "Passwords" },
  { id: 18, tip: "Disable auto-connect for Wi-Fi and Bluetooth. Your device shouldn't join networks without your knowledge.", category: "Mobile Security" },
  { id: 19, tip: "Use browser extensions like uBlock Origin to block malicious ads and trackers.", category: "Web Safety", learnMoreSlug: "safe-browsing-habits" },
  { id: 20, tip: "Set up login alerts on your important accounts to catch unauthorized access immediately.", category: "Authentication", learnMoreSlug: "two-factor-authentication" },
  { id: 21, tip: "Verify unexpected file attachments with the sender through a different communication channel.", category: "Phishing", learnMoreSlug: "how-phishing-works" },
  { id: 22, tip: "Keep your home router firmware updated and change the default admin password.", category: "Network Security", learnMoreSlug: "network-security-fundamentals" },
  { id: 23, tip: "Use the principle of least privilege: only grant permissions that are absolutely necessary.", category: "IAM", learnMoreSlug: "identity-access-management" },
  { id: 24, tip: "Create a separate email for signups and newsletters to keep your primary inbox clean.", category: "Privacy", learnMoreSlug: "data-privacy-basics" },
  { id: 25, tip: "Shred sensitive physical documents. Dumpster diving is still a real attack vector.", category: "Data Protection" },
  { id: 26, tip: "Use a privacy-focused browser like Brave or Firefox with strict tracking protection.", category: "Privacy", learnMoreSlug: "data-privacy-basics" },
  { id: 27, tip: "Never share your OTP (one-time password) with anyone — not even if they claim to be from your bank.", category: "Authentication", learnMoreSlug: "two-factor-authentication" },
  { id: 28, tip: "Audit your cloud storage sharing settings. Old shared links might still be publicly accessible.", category: "Cloud Security", learnMoreSlug: "cloud-security-fundamentals" },
  { id: 29, tip: "Use unique PINs for SIM lock and voicemail. SIM swapping attacks are on the rise.", category: "Mobile Security" },
  { id: 30, tip: "Cybersecurity is a journey, not a destination. Stay curious, keep learning, and share knowledge.", category: "Basics", learnMoreSlug: "introduction-to-cybersecurity" },
  { id: 31, tip: "Review your social media privacy settings quarterly. Platforms frequently change defaults.", category: "Privacy", learnMoreSlug: "data-privacy-basics" },
];

export function getDailyTip(): SecurityTip {
  const day = new Date().getDate();
  return securityTips[day % securityTips.length]!;
}
