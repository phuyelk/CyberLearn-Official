"use client";

import { api } from "@/trpc/react";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { WeeklyChart } from "@/components/features/weekly-chart";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { getLevel } from "@/lib/level";
import { BookOpen, Flame, Zap, Trophy, ArrowRight, Clock, Award, CheckCircle2, Lightbulb } from "lucide-react";
import Link from "next/link";
import { courses } from "@/data/courses";
import { getDailyTip } from "@/data/security-tips";

const statIcons = [BookOpen, Flame, Zap, Trophy];

export default function DashboardPage() {
  const { data: profile } = api.user.getProfile.useQuery();
  const { data: activity } = api.user.getActivity.useQuery();
  const { data: weeklyXp } = api.user.getWeeklyXp.useQuery();
  const { data: courseData } = api.courses.getAllProgress.useQuery();

  const firstName = profile?.name?.split(" ")[0] ?? "there";

  const stats = [
    { label: "Lessons Completed", value: courseData?.completedLessons.length ?? 0 },
    { label: "Current Streak", value: `${profile?.streak ?? 0} days` },
    { label: "XP Earned", value: (profile?.xp ?? 0).toLocaleString() },
    { label: "Rank", value: profile?.rank ?? "Unranked" },
  ];

  const startedSlugs = courseData?.courseProgress.map((cp) => cp.courseSlug) ?? [];
  const lastActive = courseData?.courseProgress
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
  const activeCourse = lastActive ? courses.find((c) => c.slug === lastActive.courseSlug) : null;

  const completedSlugs = new Set(courseData?.completedLessons.map((cl) => cl.courseSlug) ?? []);
  const recommended = courses
    .filter((c) => c.difficulty === "Beginner" && !completedSlugs.has(c.slug) && !startedSlugs.includes(c.slug))
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      <Topbar title="Dashboard" />
      <div className="max-w-content mx-auto px-8 py-8">
        <FadeIn>
          <h1 className="text-[32px] font-heading font-bold text-text-primary tracking-tight leading-tight">
            Welcome back, {firstName}
          </h1>
          <p className="text-text-secondary text-[15px] mt-1 mb-8">
            Keep up the great work — your cybersecurity skills are growing every day.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-4 gap-4 mb-8" staggerDelay={0.1}>
          {stats.map((stat, i) => {
            const Icon = statIcons[i];
            return (
              <StaggerItem key={i}>
                <Card>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[26px] font-heading font-semibold text-text-primary tracking-tight">{stat.value}</p>
                      <p className="text-[13px] text-text-secondary mt-1">{stat.label}</p>
                    </div>
                    <div className="w-9 h-9 rounded-input bg-bg-elevated flex items-center justify-center">
                      <Icon size={16} className="text-text-muted" />
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {activeCourse && lastActive && (
              <FadeIn delay={0.3}>
                <Card>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-heading font-medium text-[15px]">Continue Learning</h2>
                    <Badge variant="accent">{activeCourse.difficulty}</Badge>
                  </div>
                  <p className="font-heading font-medium text-[17px] mb-1">{activeCourse.title}</p>
                  <p className="text-text-secondary text-[13px] mb-4">{activeCourse.description}</p>
                  <div className="flex items-center gap-4">
                    <Progress value={lastActive.progress} className="flex-1" size="md" />
                    <span className="text-[13px] text-text-muted shrink-0">{lastActive.progress}%</span>
                    <Link href={`/learn/${activeCourse.slug}`}>
                      <Button size="sm">Resume <ArrowRight size={14} /></Button>
                    </Link>
                  </div>
                </Card>
              </FadeIn>
            )}

            {recommended.length > 0 && (
              <FadeIn delay={0.4}>
                <h2 className="font-heading font-medium text-[15px] mb-4">Recommended for You</h2>
                <StaggerContainer className="grid grid-cols-3 gap-4" staggerDelay={0.1}>
                  {recommended.map((course) => (
                    <StaggerItem key={course.slug}>
                      <Card hoverable>
                        <Badge className="mb-3">{course.category}</Badge>
                        <h3 className="font-heading font-medium text-[14px] mb-1">{course.title}</h3>
                        <p className="text-text-secondary text-[12.5px] mb-3 line-clamp-2">{course.description}</p>
                        <div className="flex items-center gap-3 text-[12px] text-text-muted mb-3">
                          <span className="flex items-center gap-1"><Clock size={12} />{course.duration}</span>
                          <span className="flex items-center gap-1"><BookOpen size={12} />{course.lessonCount} lessons</span>
                        </div>
                        <Link href={`/learn/${course.slug}`}>
                          <Button variant="secondary" size="sm" className="w-full">Start</Button>
                        </Link>
                      </Card>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </FadeIn>
            )}

            {weeklyXp && (
              <FadeIn delay={0.5}>
                <Card>
                  <h2 className="font-heading font-medium text-[15px] mb-4">Weekly Progress</h2>
                  <WeeklyChart data={weeklyXp} />
                </Card>
              </FadeIn>
            )}
          </div>

          <div className="space-y-6">
            <FadeIn delay={0.35} direction="right">
              <Card>
                <h2 className="font-heading font-medium text-[15px] mb-4">Recent Activity</h2>
                {activity && activity.length > 0 ? (
                  <div className="space-y-3">
                    {activity.slice(0, 6).map((item) => (
                      <div key={item.id} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-bg-elevated flex items-center justify-center shrink-0 mt-0.5">
                          {item.type === "badge_earned" ? <Award size={13} className="text-accent" /> :
                           item.type === "lesson_complete" ? <CheckCircle2 size={13} className="text-success" /> :
                           <Zap size={13} className="text-warning" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] text-text-primary leading-snug">{item.label}</p>
                          <p className="text-[11px] text-text-muted mt-0.5">
                            {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-text-muted">No activity yet. Start a course to get going!</p>
                )}
              </Card>
            </FadeIn>

            <FadeIn delay={0.4} direction="right">
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-warning/10 flex items-center justify-center">
                    <Lightbulb size={14} className="text-warning" />
                  </div>
                  <h2 className="font-heading font-medium text-[15px]">Daily Security Tip</h2>
                </div>
                {(() => {
                  const tip = getDailyTip();
                  return (
                    <>
                      <p className="text-[13px] text-text-primary leading-relaxed mb-2">{tip.tip}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-text-muted uppercase tracking-[0.08em]">{tip.category}</span>
                        {tip.learnMoreSlug && (
                          <Link href={`/learn/${tip.learnMoreSlug}`} className="text-[12px] text-accent hover:underline flex items-center gap-1">
                            Learn more <ArrowRight size={11} />
                          </Link>
                        )}
                      </div>
                    </>
                  );
                })()}
              </Card>
            </FadeIn>

            <FadeIn delay={0.5} direction="right">
              <Card>
                <h2 className="font-heading font-medium text-[15px] mb-3">Level Progress</h2>
                {(() => {
                  const lvl = getLevel(profile?.xp ?? 0);
                  return (
                    <>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-[22px] font-heading font-semibold">Level {lvl.level}</span>
                        <span className="text-[13px] text-text-secondary">{lvl.levelName}</span>
                      </div>
                      <Progress value={lvl.xpProgress * 100} size="md" className="mb-2" />
                      <p className="text-[12px] text-text-muted">
                        {lvl.isMax
                          ? `${(profile?.xp ?? 0).toLocaleString()} XP — Max level reached!`
                          : `${lvl.xpIntoLevel.toLocaleString()} / ${lvl.xpNeeded.toLocaleString()} XP to next level`}
                      </p>
                    </>
                  );
                })()}
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
