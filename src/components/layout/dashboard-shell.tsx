"use client";

import { FloatingParticles, GlowingGrid, PageTransition } from "@/components/ui/animations";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlowingGrid />
      <FloatingParticles count={25} />
      <div className="relative z-10">
        <PageTransition>{children}</PageTransition>
      </div>
    </>
  );
}
