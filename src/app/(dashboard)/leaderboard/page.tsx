"use client";

import { api } from "@/trpc/react";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Trophy, Crown, Medal, Flame, Zap, TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";

const positionColors: Record<number, string> = {
  1: "text-yellow-400",
  2: "text-gray-300",
  3: "text-amber-600",
};

const positionBg: Record<number, string> = {
  1: "bg-yellow-400/10 border-yellow-400/20",
  2: "bg-gray-300/10 border-gray-300/20",
  3: "bg-amber-600/10 border-amber-600/20",
};

export default function LeaderboardPage() {
  const { data: leaderboard, isLoading } = api.leaderboard.getLeaderboard.useQuery();
  const { data: myRank } = api.leaderboard.getMyRank.useQuery();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen">
      <Topbar title="Leaderboard" />
      <div className="max-w-content mx-auto px-8 py-8">
        <FadeIn>
          <h1 className="text-[28px] font-heading font-bold text-text-primary tracking-tight mb-1">
            Leaderboard
          </h1>
          <p className="text-text-secondary text-[15px] mb-8">
            See how you stack up against other learners. Earn XP to climb the ranks!
          </p>
        </FadeIn>

        {myRank && (
          <FadeIn delay={0.15}>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-input bg-accent-soft flex items-center justify-center">
                    <TrendingUp size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-[22px] font-heading font-semibold text-text-primary">#{myRank.position}</p>
                    <p className="text-[13px] text-text-secondary">Your Rank</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-input bg-success/10 flex items-center justify-center">
                    <Trophy size={18} className="text-success" />
                  </div>
                  <div>
                    <p className="text-[22px] font-heading font-semibold text-text-primary">{myRank.total}</p>
                    <p className="text-[13px] text-text-secondary">Total Players</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-input bg-warning/10 flex items-center justify-center">
                    <Zap size={18} className="text-warning" />
                  </div>
                  <div>
                    <p className="text-[22px] font-heading font-semibold text-text-primary">
                      Top {myRank.total > 0 ? Math.round((myRank.position / myRank.total) * 100) : 0}%
                    </p>
                    <p className="text-[13px] text-text-secondary">Percentile</p>
                  </div>
                </div>
              </Card>
            </div>
          </FadeIn>
        )}

        <FadeIn delay={0.25}>
          <Card className="overflow-hidden !p-0">
            <div className="px-6 py-4 border-b border-border">
              <div className="grid grid-cols-12 gap-4 text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
                <div className="col-span-1">#</div>
                <div className="col-span-4">Player</div>
                <div className="col-span-2">Level</div>
                <div className="col-span-2 text-right">XP</div>
                <div className="col-span-1 text-right">Streak</div>
                <div className="col-span-2 text-right">Rank</div>
              </div>
            </div>

            {isLoading ? (
              <div className="px-6 py-12 text-center text-text-muted text-[14px]">
                Loading leaderboard...
              </div>
            ) : leaderboard && leaderboard.length > 0 ? (
              <StaggerContainer staggerDelay={0.04}>
                {leaderboard.map((user) => (
                  <StaggerItem key={user.id}>
                    <div
                      className={cn(
                        "grid grid-cols-12 gap-4 items-center px-6 py-3 border-b border-border/50 transition-colors hover:bg-bg-elevated/50",
                        user.isCurrentUser && "bg-accent-soft/50 hover:bg-accent-soft/70",
                        user.position <= 3 && positionBg[user.position]
                      )}
                    >
                      <div className="col-span-1">
                        {user.position <= 3 ? (
                          <div className={cn("flex items-center", positionColors[user.position])}>
                            {user.position === 1 ? <Crown size={18} /> : <Medal size={18} />}
                          </div>
                        ) : (
                          <span className="text-[14px] font-medium text-text-muted">{user.position}</span>
                        )}
                      </div>

                      <div className="col-span-4 flex items-center gap-3">
                        <Avatar
                          src={user.image}
                          name={user.name}
                          size="sm"
                          className={user.isCurrentUser ? "ring-2 ring-accent" : ""}
                        />
                        <div>
                          <p className={cn(
                            "text-[14px] font-medium",
                            user.isCurrentUser ? "text-accent" : "text-text-primary"
                          )}>
                            {user.name}
                            {user.isCurrentUser && <span className="text-[11px] text-accent ml-1.5">(you)</span>}
                          </p>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <Badge variant="accent">Lv.{user.level} {user.levelName}</Badge>
                      </div>

                      <div className="col-span-2 text-right">
                        <span className="text-[14px] font-semibold text-text-primary">{user.xp.toLocaleString()}</span>
                        <span className="text-[12px] text-text-muted ml-1">XP</span>
                      </div>

                      <div className="col-span-1 text-right flex items-center justify-end gap-1">
                        <Flame size={13} className="text-warning" />
                        <span className="text-[13px] text-text-secondary">{user.streak}</span>
                      </div>

                      <div className="col-span-2 text-right">
                        <span className="text-[13px] text-text-secondary">{user.rank}</span>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <div className="px-6 py-12 text-center text-text-muted text-[14px]">
                No players yet. Be the first to earn some XP!
              </div>
            )}
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
