"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/trpc/react";
import { Bot, X, Send, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "model";
  content: string;
}

function formatContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\n)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-text-primary">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="px-1 py-0.5 bg-bg-elevated rounded text-accent text-[12px] font-mono">{part.slice(1, -1)}</code>;
    }
    if (part === "\n") return <br key={i} />;
    return <span key={i}>{part}</span>;
  });
}

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMutation = api.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "model", content: data.content }]);
    },
    onError: (err) => {
      const msg = err?.message?.includes("429") || err?.message?.includes("quota")
        ? "Rate limit reached — please wait a moment and try again."
        : err?.message || "Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "model", content: msg }]);
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sendMutation.isPending]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  function handleSend() {
    const text = input.trim();
    if (!text || sendMutation.isPending) return;
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    sendMutation.mutate({ messages: newMessages });
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            className="fixed bottom-20 right-6 w-[380px] h-[520px] bg-bg-panel border border-border rounded-card shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-panel">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
                  <Bot size={14} className="text-accent" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-text-primary">CyberGuard</p>
                  <p className="text-[10px] text-text-muted">AI Security Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-input text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                    <Sparkles size={20} className="text-accent" />
                  </div>
                  <p className="text-[14px] font-medium text-text-primary mb-1">Hi! I'm CyberGuard</p>
                  <p className="text-[12px] text-text-secondary mb-4">
                    Your AI security assistant. Ask me about cybersecurity, or how to use CyberLearn!
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["What should I learn first?", "How do I check a suspicious URL?", "What is phishing?"].map((q) => (
                      <button
                        key={q}
                        onClick={() => { setInput(q); }}
                        className="px-3 py-1.5 bg-bg-elevated border border-border rounded-input text-[11px] text-text-secondary hover:text-text-primary hover:border-border-focus transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] px-3 py-2 rounded-card text-[13px] leading-relaxed",
                      msg.role === "user"
                        ? "bg-accent text-white rounded-br-sm"
                        : "bg-bg-elevated text-text-primary rounded-bl-sm"
                    )}
                  >
                    {msg.role === "model" ? formatContent(msg.content) : msg.content}
                  </div>
                </div>
              ))}

              {sendMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-bg-elevated px-3 py-2 rounded-card rounded-bl-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-3 py-3 border-t border-border">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about security..."
                  className="flex-1 h-9 px-3 bg-bg-elevated border border-border rounded-input text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sendMutation.isPending}
                  className={cn(
                    "w-9 h-9 flex items-center justify-center rounded-input transition-colors",
                    input.trim() && !sendMutation.isPending
                      ? "bg-accent text-white hover:bg-accent/85"
                      : "bg-bg-elevated text-text-muted"
                  )}
                >
                  {sendMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center z-50 shadow-lg transition-colors",
          open ? "bg-bg-elevated text-text-primary" : "bg-accent text-white"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? <X size={20} /> : <Bot size={20} />}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-20" />
        )}
      </motion.button>
    </>
  );
}
