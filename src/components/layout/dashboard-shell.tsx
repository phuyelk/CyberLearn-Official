"use client";

import { FloatingParticles, GlowingGrid, PageTransition } from "@/components/ui/animations";
import { AIChat } from "@/components/features/ai-chat";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlowingGrid />
      <FloatingParticles count={25} />
      <div className="relative z-10">
        <PageTransition>{children}</PageTransition>
      </div>
      <AIChat />
    </>
  );
}
