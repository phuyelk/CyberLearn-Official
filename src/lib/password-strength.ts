const COMMON_PASSWORDS = [
  "password","123456","12345678","qwerty","abc123","monkey","1234567","letmein",
  "trustno1","dragon","baseball","iloveyou","master","sunshine","ashley","bailey",
  "passw0rd","shadow","123123","654321","superman","qazwsx","michael","football",
  "password1","password123","welcome","hello","charlie","donald","admin","admin123",
];

export interface PasswordCheck { label: string; passed: boolean }
export interface PasswordAnalysis { score: number; label: string; checks: PasswordCheck[]; crackTime: string; entropy: number }

function calculateEntropy(pw: string): number {
  let cs = 0;
  if (/[a-z]/.test(pw)) cs += 26;
  if (/[A-Z]/.test(pw)) cs += 26;
  if (/[0-9]/.test(pw)) cs += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) cs += 33;
  return cs === 0 ? 0 : Math.floor(pw.length * Math.log2(cs));
}

function estimateCrackTime(entropy: number): string {
  const sec = Math.pow(2, entropy) / 1e10;
  if (sec < 1) return "instantly";
  if (sec < 60) return `about ${Math.ceil(sec)} seconds`;
  if (sec < 3600) return `about ${Math.ceil(sec / 60)} minutes`;
  if (sec < 86400) return `about ${Math.ceil(sec / 3600)} hours`;
  if (sec < 86400 * 30) return `about ${Math.ceil(sec / 86400)} days`;
  if (sec < 86400 * 365) return `about ${Math.ceil(sec / (86400 * 30))} months`;
  if (sec < 86400 * 365 * 100) return `about ${Math.ceil(sec / (86400 * 365))} years`;
  if (sec < 86400 * 365 * 1000) return "centuries";
  return "millennia+";
}

export function analyzePassword(password: string): PasswordAnalysis {
  const empty = !password;
  const checks: PasswordCheck[] = [
    { label: "12+ characters", passed: !empty && password.length >= 12 },
    { label: "Uppercase letter", passed: !empty && /[A-Z]/.test(password) },
    { label: "Lowercase letter", passed: !empty && /[a-z]/.test(password) },
    { label: "Number", passed: !empty && /[0-9]/.test(password) },
    { label: "Special character", passed: !empty && /[^a-zA-Z0-9]/.test(password) },
    { label: "Not a common password", passed: empty || !COMMON_PASSWORDS.includes(password.toLowerCase()) },
  ];
  if (empty) return { score: 0, label: "", checks, crackTime: "", entropy: 0 };

  const passedCount = checks.filter((c) => c.passed).length;
  const isCommon = COMMON_PASSWORDS.includes(password.toLowerCase());
  const entropy = calculateEntropy(password);

  let score: number;
  if (isCommon || password.length < 4) score = 0;
  else if (passedCount <= 2 || password.length < 6) score = 1;
  else if (passedCount <= 3 || password.length < 8) score = 2;
  else if (passedCount <= 4 || password.length < 12) score = 3;
  else score = 4;

  const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  return { score, label: labels[score], checks, crackTime: estimateCrackTime(entropy), entropy };
}
