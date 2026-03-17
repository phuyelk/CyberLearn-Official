"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, ChevronRight, User, Settings, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import { getLevel } from "@/lib/level";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";

export function Topbar({
  title,
  breadcrumbs,
}: {
  title: string;
  breadcrumbs?: { label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const { data: profile } = api.user.getProfile.useQuery();
  const lvl = getLevel(profile?.xp ?? 0);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <header className="h-14 flex items-center justify-between px-8 border-b border-border shrink-0">
      <div className="flex items-center gap-2">
        {breadcrumbs?.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            <span className="text-[13px] text-text-muted">{crumb.label}</span>
            <ChevronRight size={12} className="text-text-muted" />
          </span>
        ))}
        <h1 className="font-heading font-medium text-[18px] text-text-primary tracking-tight">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-8 h-8 flex items-center justify-center rounded-input text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors duration-hover">
          <Bell size={16} />
        </button>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full hover:ring-2 hover:ring-border-focus transition-all duration-hover"
          >
            <Avatar src={profile?.image} name={session?.user?.name ?? "User"} size="sm" />
          </button>
          {open && (
            <div className="absolute right-0 top-10 w-64 bg-bg-panel border border-border rounded-card shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-[14px] font-medium text-text-primary truncate">
                  {session?.user?.name ?? profile?.name ?? "User"}
                </p>
                <p className="text-[12px] text-text-muted truncate">
                  {session?.user?.email ?? profile?.email ?? ""}
                </p>
              </div>
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Zap size={13} className="text-accent" />
                    <span className="text-[13px] font-medium text-text-primary">Level {lvl.level}</span>
                  </div>
                  <Badge variant="accent" className="text-[10px]">{lvl.levelName}</Badge>
                </div>
                <Progress value={lvl.xpProgress * 100} size="sm" className="mb-1" />
                <p className="text-[11px] text-text-muted">
                  {lvl.isMax
                    ? "Max level reached!"
                    : `${lvl.xpIntoLevel} / ${lvl.xpNeeded} XP to next level`}
                </p>
              </div>
              <div className="p-2">
                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-input text-[13px] text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
                >
                  <Settings size={14} />
                  <span>Settings</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
