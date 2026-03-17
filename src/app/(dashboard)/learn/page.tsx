"use client";

import { useState, useMemo } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import Link from "next/link";
import { courses } from "@/data/courses";

const TABS = ["All", "Beginner", "Intermediate", "Advanced"] as const;

const catVariant: Record<string, "default" | "success" | "warning" | "danger" | "accent"> = {
  Fundamentals: "accent", Phishing: "danger", "Social Engineering": "warning",
  Authentication: "success", "Web Safety": "default", Malware: "danger",
  "Network Security": "accent", Privacy: "success", "Incident Response": "warning",
  Cryptography: "accent", "Cloud Security": "success", "Mobile Security": "warning",
  "Email Security": "danger", "Threat Intelligence": "accent", Compliance: "default",
  "Ethical Hacking": "warning",
};

export default function LearnPage() {
  const [tab, setTab] = useState<string>("All");
  const [search, setSearch] = useState("");
  const { data: courseData } = api.courses.getAllProgress.useQuery();

  const progressMap = useMemo(() => {
    const m: Record<string, number> = {};
    courseData?.courseProgress.forEach((cp) => { m[cp.courseSlug] = cp.progress; });
    return m;
  }, [courseData]);

  const filtered = useMemo(() =>
    courses.filter((c) => {
      const matchTab = tab === "All" || c.difficulty === tab;
      const matchSearch = !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    }), [tab, search]);

  return (
    <div className="min-h-screen">
      <Topbar title="Course Library" />
      <div className="max-w-content mx-auto px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1 bg-bg-panel border border-border rounded-input p-1">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={cn("px-3 py-1.5 rounded-badge text-[13px] font-medium transition-colors duration-hover",
                  tab === t ? "bg-bg-elevated text-text-primary" : "text-text-secondary hover:text-text-primary")}>
                {t}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {filtered.map((course) => {
            const progress = progressMap[course.slug];
            const hasStarted = progress !== undefined;
            return (
              <Card key={course.slug} hoverable>
                <Badge variant={catVariant[course.category] ?? "default"} className="mb-3">{course.category}</Badge>
                <h3 className="font-heading font-medium text-[15px] mb-1">{course.title}</h3>
                <p className="text-text-secondary text-[13px] mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-3 text-[12px] text-text-muted mb-4">
                  <span className="flex items-center gap-1"><Clock size={12} />{course.duration}</span>
                  <span className="flex items-center gap-1"><BookOpen size={12} />{course.lessonCount} lessons</span>
                  <Badge className="ml-auto">{course.difficulty}</Badge>
                </div>
                {hasStarted ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-text-muted">{progress}% complete</span>
                    </div>
                    <Progress value={progress} size="sm" />
                    <Link href={`/learn/${course.slug}`}>
                      <Button variant="secondary" size="sm" className="w-full mt-2">Continue</Button>
                    </Link>
                  </div>
                ) : (
                  <Link href={`/learn/${course.slug}`}>
                    <Button variant="secondary" size="sm" className="w-full">Start Course</Button>
                  </Link>
                )}
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-secondary text-body mb-2">No courses match your search.</p>
            <p className="text-text-muted text-[13px]">Try a different filter or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
