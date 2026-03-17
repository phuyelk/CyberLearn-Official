import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are CyberGuard, the AI security assistant for CyberLearn — a cybersecurity learning platform. Your role:

1. Help users navigate the platform. Key pages:
   - /dashboard — main overview
   - /learn — course library
   - /progress — badges, streaks, XP
   - /leaderboard — compete with others
   - /tools/phishing-detector — analyze suspicious URLs
   - /tools/password-analyzer — check password strength
   - /tools/threat-quiz — security knowledge quiz
   - /tools/cipher-playground — encrypt/decrypt text
   - /tools/ip-intel — IP address intelligence
   - /tools/website-scanner — scan websites for threats
   - /settings — profile, password, preferences

2. Answer cybersecurity questions clearly and accurately at a beginner-to-intermediate level.
3. Suggest relevant courses or tools based on what the user asks about.
4. Keep responses concise (2-4 paragraphs max unless the user asks for detail).
5. Use a friendly, encouraging tone. You're a tutor, not a textbook.
6. If asked about something outside cybersecurity/the platform, politely redirect.
7. Format responses with **bold** for key terms and use bullet points for lists.`;

export const chatRouter = createTRPCRouter({
  sendMessage: protectedProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "model"]),
            content: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
          history: [
            { role: "user", parts: [{ text: "System instructions: " + SYSTEM_PROMPT }] },
            { role: "model", parts: [{ text: "Understood! I'm CyberGuard, ready to help with cybersecurity questions and navigate CyberLearn. How can I assist you?" }] },
            ...input.messages.slice(0, -1).map((m) => ({
              role: m.role as "user" | "model",
              parts: [{ text: m.content }],
            })),
          ],
        });

        const lastMessage = input.messages[input.messages.length - 1];
        if (!lastMessage) throw new Error("No message provided");

        const result = await chat.sendMessage(lastMessage.content);
        const response = result.response.text();

        return { content: response };
      } catch (err: any) {
        const msg = err?.message ?? String(err);
        console.error("[CyberGuard AI Error]", msg);
        if (msg.includes("429") || msg.includes("quota") || msg.includes("Too Many Requests") || msg.includes("RESOURCE_EXHAUSTED")) {
          return { content: "I'm currently experiencing high demand. Please wait a minute and try again." };
        }
        if (msg.includes("API_KEY") || msg.includes("401") || msg.includes("403")) {
          return { content: "There's a configuration issue with my AI backend. Please let the admin know." };
        }
        if (msg.includes("fetch") || msg.includes("ENOTFOUND") || msg.includes("ETIMEDOUT")) {
          return { content: "I'm having trouble reaching my AI service right now. Please try again in a moment." };
        }
        return { content: "Something went wrong on my end. Please try again in a moment." };
      }
    }),
});
