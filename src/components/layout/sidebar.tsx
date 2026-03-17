"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getLevel } from "@/lib/level";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { api } from "@/trpc/react";
import {
  Shield, LayoutDashboard, BookOpen, Fish, KeyRound,
  HelpCircle, Lock, BarChart3, Settings, User, LogOut,
  Trophy, Globe, ScanSearch,
} from "lucide-react";

const navGroups = [
  {
    label: "LEARN",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/learn", label: "Courses", icon: BookOpen },
      { href: "/progress", label: "My Progress", icon: BarChart3 },
      { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    ],
  },
  {
    label: "TOOLS",
    items: [
      { href: "/tools/phishing-detector", label: "Phishing Detector", icon: Fish },
      { href: "/tools/password-analyzer", label: "Password Analyzer", icon: KeyRound },
      { href: "/tools/threat-quiz", label: "Security Quiz", icon: HelpCircle },
      { href: "/tools/cipher-playground", label: "Cipher Playground", icon: Lock },
      { href: "/tools/ip-intel", label: "IP Intelligence", icon: Globe },
      { href: "/tools/website-scanner", label: "Website Scanner", icon: ScanSearch },
    ],
  },
  {
    label: "ACCOUNT",
    items: [{ href: "/settings", label: "Settings", icon: Settings }],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data: profile } = api.user.getProfile.useQuery();
  const lvl = getLevel(profile?.xp ?? 0);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-bg-panel border-r border-border flex flex-col z-40">
      <div className="px-4 h-14 flex items-center gap-2.5 shrink-0">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
        >
          <Shield size={20} className="text-accent" />
        </motion.div>
        <span className="font-heading font-medium text-[15px] text-text-primary tracking-tight">
          CyberLearn
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="px-3 mb-1 text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2.5 px-3 py-1.5 rounded-input text-[13.5px] transition-colors duration-hover",
                    isActive
                      ? "text-accent font-medium"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-accent-soft rounded-input"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2.5">
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-border shrink-0">
        <div className="flex items-center gap-2.5">
          <Avatar src={profile?.image} name={session?.user?.name ?? "User"} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-text-primary truncate">
              {session?.user?.name ?? "User"}
            </p>
            <Badge variant="accent" glow className="mt-0.5">Level {lvl.level} &middot; {lvl.levelName}</Badge>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-1.5 rounded-input text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors duration-hover"
            title="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
