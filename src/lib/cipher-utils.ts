export type CipherType = "caesar" | "rot13" | "base64" | "binary";
export type CipherMode = "encode" | "decode";

function caesarShift(text: string, shift: number): string {
  return text.split("").map((c) => {
    if (/[a-z]/.test(c)) return String.fromCharCode(((c.charCodeAt(0) - 97 + shift) % 26) + 97);
    if (/[A-Z]/.test(c)) return String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26) + 65);
    return c;
  }).join("");
}

export function processCipher(text: string, cipher: CipherType, mode: CipherMode, shift = 3): string {
  if (!text) return "";
  switch (cipher) {
    case "caesar": return mode === "encode" ? caesarShift(text, shift) : caesarShift(text, 26 - (shift % 26));
    case "rot13": return caesarShift(text, 13);
    case "base64":
      try { return mode === "encode" ? btoa(unescape(encodeURIComponent(text))) : decodeURIComponent(escape(atob(text.trim()))); }
      catch { return "Error: Invalid input"; }
    case "binary":
      if (mode === "encode") return text.split("").map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
      try { return text.trim().split(/\s+/).map((b) => String.fromCharCode(parseInt(b, 2))).join(""); }
      catch { return "Error: Invalid binary"; }
    default: return text;
  }
}

export const cipherDescriptions: Record<CipherType, string> = {
  caesar: "The Caesar Cipher shifts each letter by a fixed number of positions. Named after Julius Caesar, who used it for military communication. With only 25 possible shifts, it's easily broken by trying all possibilities.",
  rot13: "ROT13 shifts letters by 13 positions. Because the alphabet has 26 letters, applying ROT13 twice returns the original text. Commonly used online to hide spoilers — not for real security.",
  base64: "Base64 encodes binary data into ASCII text using 64 characters (A–Z, a–z, 0–9, +, /). Used to safely transmit data in email and URLs. It's encoding, not encryption — anyone can decode it.",
  binary: "Binary represents data using only 0s and 1s — the fundamental language of computers. Each character is converted to its 8-bit binary equivalent.",
};
