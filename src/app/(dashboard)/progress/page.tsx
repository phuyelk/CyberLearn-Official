"use client";

import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StreakCalendar } from "@/components/features/streak-calendar";
import { api } from "@/trpc/react";
import { getLevel } from "@/lib/level";
import { allBadges } from "@/data/badges";
import {
  BookOpen, KeyRound, Fish, Flame, Zap, Trophy, Wrench,
  GraduationCap, Lock, CheckCircle2,
} from "lucide-react";

const iconMap: Record<string, typeof BookOpen> = {
  BookOpen, KeyRound, Fish, Flame, Zap, Trophy, Wrench, GraduationCap,
};

export default function ProgressPage() {
  const { data: stats } = api.progress.getStats.useQuery();
  const { data: earnedBadges } = api.progress.getBadges.useQuery();
  const { data: completedLessons } = api.progress.getCompletedLessons.useQuery();
  const { data: calendar } = api.progress.getStreakCalendar.useQuery();

  const earnedIds = new Set(earnedBadges?.map((b) => b.badgeId) ?? []);

  return (
    <div className="min-h-screen">
      <Topbar title="My Progress" />
      <div className="max-w-content mx-auto px-8 py-8">
        <Card className="mb-8">
          {(() => {
            const lvl = getLevel(stats?.xp ?? 0);
            return (
              <>
                <div className="flex items-baseline gap-3 mb-3">
                  <h2 className="font-heading text-[22px] font-semibold">Level {lvl.level}</h2>
                  <span className="text-text-secondary text-[14px]">{lvl.levelName}</span>
                </div>
                <Progress value={lvl.xpProgress * 100} size="md" className="mb-2" />
                <p className="text-[13px] text-text-muted">
                  {lvl.isMax
                    ? `${(stats?.xp ?? 0).toLocaleString()} XP \u2014 Max level reached!`
                    : `${lvl.xpIntoLevel.toLocaleString()} / ${lvl.xpNeeded.toLocaleString()} XP to next level`}
                </p>
              </>
            );
          })()}
          <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-border">
            <div>
              <p className="text-[24px] font-heading font-semibold">{stats?.lessonsCompleted ?? 0}</p>
              <p className="text-[13px] text-text-secondary">Lessons Completed</p>
            </div>
            <div>
              <p className="text-[24px] font-heading font-semibold">{stats?.streak ?? 0} days</p>
              <p className="text-[13px] text-text-secondary">Current Streak</p>
            </div>
            <div>
              <p className="text-[24px] font-heading font-semibold">{stats?.rank ?? "Unranked"}</p>
              <p className="text-[13px] text-text-secondary">Rank</p>
            </div>
          </div>
        </Card>

        <h2 className="font-heading font-medium text-[16px] mb-4">Badges</h2>
        <div className="grid grid-cols-4 gap-4 mb-8">
          {allBadges.map((badge) => {
            const earned = earnedIds.has(badge.id);
            const Icon = iconMap[badge.icon] ?? Trophy;
            return (
              <Card key={badge.id} className={earned ? "" : "opacity-50"}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-card flex items-center justify-center ${earned ? "bg-accent-soft" : "bg-bg-elevated"}`}>
                    {earned ? <Icon size={20} className="text-accent" /> : <Lock size={16} className="text-text-muted" />}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-text-primary">{badge.name}</p>
                    <p className="text-[11px] text-text-muted">{badge.description}</p>
                  </div>
                </div>
                {earned && (
                  <Badge variant="success" className="mt-1">Earned</Badge>
                )}
              </Card>
            );
          })}
        </div>

        <h2 className="font-heading font-medium text-[16px] mb-4">Streak Calendar</h2>
        <Card className="mb-8">
          {calendar ? <StreakCalendar data={calendar} /> : <p className="text-[13px] text-text-muted">Loading...</p>}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-[2px] bg-bg-elevated" />
              <span className="text-[11px] text-text-muted">No activity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-[2px] bg-accent/20" />
              <span className="text-[11px] text-text-muted">Low</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-[2px] bg-accent/45" />
              <span className="text-[11px] text-text-muted">Medium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-[2px] bg-accent/75" />
              <span className="text-[11px] text-text-muted">High</span>
            </div>
          </div>
        </Card>

        <h2 className="font-heading font-medium text-[16px] mb-4">Completed Lessons</h2>
        {completedLessons && completedLessons.length > 0 ? (
          <div className="space-y-2">
            {completedLessons.map((l) => (
              <Card key={l.id} className="py-3 px-4 flex items-center gap-3">
                <CheckCircle2 size={16} className="text-success shrink-0" />
                <span className="text-[13px] text-text-primary flex-1">{l.lessonSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                <span className="text-[12px] text-text-muted">
                  {new Date(l.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-[13px] text-text-muted text-center py-4">
              No completed lessons yet. Start a course to track your progress here.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
