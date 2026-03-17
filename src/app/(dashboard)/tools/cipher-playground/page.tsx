"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Callout } from "@/components/ui/callout";
import { processCipher, cipherDescriptions, type CipherType, type CipherMode } from "@/lib/cipher-utils";
import { cn } from "@/lib/utils";

const ciphers: { id: CipherType; label: string }[] = [
  { id: "caesar", label: "Caesar Cipher" },
  { id: "rot13", label: "ROT13" },
  { id: "base64", label: "Base64" },
  { id: "binary", label: "Binary" },
];

export default function CipherPlaygroundPage() {
  const [input, setInput] = useState("");
  const [cipher, setCipher] = useState<CipherType>("caesar");
  const [mode, setMode] = useState<CipherMode>("encode");
  const [shift, setShift] = useState(3);

  const output = processCipher(input, cipher, mode, shift);

  return (
    <div className="min-h-screen">
      <Topbar title="Cipher Playground" breadcrumbs={[{ label: "Tools" }]} />
      <div className="max-w-content mx-auto px-8 py-8">
        <p className="text-text-secondary text-body mb-6 max-w-2xl">
          Experiment with basic encoding and ciphers. Type text on the left and see the result on the right in real time.
        </p>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1 bg-bg-panel border border-border rounded-input p-1">
            {(["encode", "decode"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={cn("px-3 py-1.5 rounded-badge text-[13px] font-medium capitalize transition-colors duration-hover",
                  mode === m ? "bg-bg-elevated text-text-primary" : "text-text-secondary hover:text-text-primary")}>
                {m}
              </button>
            ))}
          </div>

          <select value={cipher} onChange={(e) => setCipher(e.target.value as CipherType)}
            className="bg-bg-elevated border border-border rounded-input px-3 py-2 text-[13px] text-text-primary focus:outline-none focus:border-border-focus">
            {ciphers.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>

          {cipher === "caesar" && (
            <div className="flex items-center gap-2">
              <label className="text-[13px] text-text-secondary">Shift:</label>
              <input type="number" min={1} max={25} value={shift} onChange={(e) => setShift(Number(e.target.value))}
                className="w-14 bg-bg-elevated border border-border rounded-input px-2 py-1.5 text-[13px] text-text-primary text-center focus:outline-none focus:border-border-focus" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-0">
            <div className="px-4 py-2 border-b border-border">
              <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-text-muted">Input</p>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "encode" ? "Type your text here..." : "Paste encoded text here..."}
              className="w-full h-48 bg-transparent px-4 py-3 text-body font-mono text-text-primary placeholder:text-text-muted resize-none focus:outline-none"
            />
          </Card>

          <Card className="p-0">
            <div className="px-4 py-2 border-b border-border">
              <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-text-muted">Output</p>
            </div>
            <div className="w-full h-48 px-4 py-3 text-body font-mono text-text-primary overflow-auto whitespace-pre-wrap break-all">
              {output || <span className="text-text-muted">Result will appear here...</span>}
            </div>
          </Card>
        </div>

        <Card className="mb-6">
          <h3 className="font-heading font-medium text-[15px] mb-2">How {ciphers.find((c) => c.id === cipher)?.label} works</h3>
          <p className="text-text-secondary text-[13px] leading-relaxed">{cipherDescriptions[cipher]}</p>
        </Card>

        <Callout variant="info">
          This is not real encryption — it&apos;s for learning only. These methods are easily reversed and should never be used to protect sensitive data.
        </Callout>
      </div>
    </div>
  );
}
