"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { api } from "@/trpc/react";
import { quizQuestions } from "@/data/quiz-questions";
import { CheckCircle2, XCircle, RotateCcw, BookOpen, Timer, Flame, Zap, BarChart3, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const QUESTIONS_PER_QUIZ = 15;
const SECONDS_PER_QUESTION = 30;

function shuffleAndPick(count: number) {
  const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

const TOPIC_LABELS: Record<string, string> = {
  "phishing": "Phishing",
  "passwords": "Passwords",
  "web-security": "Web Security",
  "social-engineering": "Social Engineering",
  "authentication": "Authentication",
  "malware": "Malware",
  "network-security": "Network Security",
  "cryptography": "Cryptography",
  "incident-response": "Incident Response",
  "security-architecture": "Security Architecture",
  "offensive-security": "Offensive Security",
  "data-privacy": "Data Privacy",
};

const DIFF_COLORS: Record<string, string> = {
  easy: "text-success",
  medium: "text-warning",
  hard: "text-danger",
};

export default function ThreatQuizPage() {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState(shuffleAndPick(QUESTIONS_PER_QUIZ));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState(false);
  const [complete, setComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [timedOut, setTimedOut] = useState(false);

  const submitResult = api.quiz.submitResult.useMutation();

  const q = questions[current]!;
  const selected = answers[current];
  const totalQ = questions.length;

  useEffect(() => {
    if (!started || revealed || complete) return;
    if (timeLeft <= 0) {
      setTimedOut(true);
      setRevealed(true);
      setStreak(0);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, started, revealed, complete]);

  const handleSelect = useCallback((idx: number) => {
    if (revealed) return;
    setAnswers((prev) => ({ ...prev, [current]: idx }));
    setRevealed(true);
    setTimedOut(false);
    if (idx === q.correctIndex) {
      setStreak((s) => {
        const next = s + 1;
        setMaxStreak((m) => Math.max(m, next));
        return next;
      });
    } else {
      setStreak(0);
    }
  }, [revealed, current, q.correctIndex]);

  const handleNext = useCallback(() => {
    if (current < totalQ - 1) {
      setCurrent((p) => p + 1);
      setRevealed(false);
      setTimedOut(false);
      setTimeLeft(SECONDS_PER_QUESTION);
    } else {
      const score = questions.filter((qq, i) => answers[i] === qq.correctIndex).length;
      submitResult.mutate({ score, totalQuestions: totalQ });
      setComplete(true);
    }
  }, [current, totalQ, questions, answers, submitResult]);

  const handleStart = useCallback(() => {
    setQuestions(shuffleAndPick(QUESTIONS_PER_QUIZ));
    setCurrent(0);
    setAnswers({});
    setRevealed(false);
    setComplete(false);
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(SECONDS_PER_QUESTION);
    setTimedOut(false);
    setStarted(true);
  }, []);

  const topicBreakdown = useMemo(() => {
    if (!complete) return [];
    const map: Record<string, { correct: number; total: number }> = {};
    questions.forEach((qq, i) => {
      if (!map[qq.topic]) map[qq.topic] = { correct: 0, total: 0 };
      map[qq.topic]!.total++;
      if (answers[i] === qq.correctIndex) map[qq.topic]!.correct++;
    });
    return Object.entries(map)
      .map(([topic, data]) => ({ topic, label: TOPIC_LABELS[topic] ?? topic, ...data }))
      .sort((a, b) => a.correct / a.total - b.correct / b.total);
  }, [complete, questions, answers]);

  if (!started) {
    return (
      <div className="min-h-screen">
        <Topbar title="Security Quiz" breadcrumbs={[{ label: "Tools" }]} />
        <div className="max-w-content mx-auto px-8 py-8">
          <div className="max-w-xl mx-auto">
            <Card className="text-center">
              <div className="w-14 h-14 rounded-card bg-accent-soft flex items-center justify-center mx-auto mb-4">
                <Zap size={24} className="text-accent" />
              </div>
              <h2 className="font-heading text-[20px] font-semibold mb-2">Security Awareness Quiz</h2>
              <p className="text-text-secondary text-[14px] mb-6 max-w-sm mx-auto">
                Test your cybersecurity knowledge with {QUESTIONS_PER_QUIZ} randomized questions. You have {SECONDS_PER_QUESTION} seconds per question. Build streaks for consecutive correct answers!
              </p>
              <div className="flex justify-center gap-6 mb-6 text-[13px] text-text-muted">
                <div className="flex items-center gap-1.5">
                  <Timer size={14} />
                  <span>{SECONDS_PER_QUESTION}s per question</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BarChart3 size={14} />
                  <span>{quizQuestions.length} question pool</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame size={14} />
                  <span>Streak bonus</span>
                </div>
              </div>
              <div className="flex gap-2 justify-center mb-4">
                <Badge>Easy</Badge>
                <Badge variant="warning">Medium</Badge>
                <Badge variant="danger">Hard</Badge>
              </div>
              <Button onClick={handleStart} className="px-8">Start Quiz</Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (complete) {
    const score = questions.filter((qq, i) => answers[i] === qq.correctIndex).length;
    const pct = Math.round((score / totalQ) * 100);
    const wrong = questions
      .map((qq, i) => ({ ...qq, idx: i }))
      .filter((qq) => answers[qq.idx] !== qq.correctIndex);
    const perfLabel = pct >= 90 ? "Expert" : pct >= 70 ? "Advanced" : pct >= 50 ? "Intermediate" : "Beginner";
    const perfVariant = pct >= 90 ? "success" as const : pct >= 70 ? "accent" as const : pct >= 50 ? "warning" as const : "danger" as const;

    return (
      <div className="min-h-screen">
        <Topbar title="Quiz Results" breadcrumbs={[{ label: "Tools" }, { label: "Security Quiz" }]} />
        <div className="max-w-content mx-auto px-8 py-8">
          <Card className="max-w-xl mx-auto text-center mb-6">
            <p className="text-[48px] font-heading font-bold text-accent mb-1">{score}/{totalQ}</p>
            <p className="text-[14px] text-text-muted mb-3">{pct}% correct</p>
            <Badge variant={perfVariant} className="mb-4">{perfLabel}</Badge>

            <div className="flex justify-center gap-6 mb-6">
              <div className="text-center">
                <p className="text-[18px] font-heading font-semibold text-text-primary">{maxStreak}</p>
                <p className="text-[11px] text-text-muted flex items-center gap-1 justify-center"><Flame size={11} className="text-warning" /> Best Streak</p>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <p className="text-[18px] font-heading font-semibold text-text-primary">{questions.filter((q) => q.difficulty === "hard").filter((q, i) => answers[questions.indexOf(q)] === q.correctIndex).length}</p>
                <p className="text-[11px] text-text-muted">Hard Correct</p>
              </div>
            </div>

            <p className="text-text-secondary text-[14px] mb-6">
              {pct >= 90 ? "Outstanding! You have an expert-level understanding of security concepts." :
               pct >= 70 ? "Great work! Review the missed questions below to reach expert level." :
               pct >= 50 ? "Good foundation! Study the topics below to strengthen your knowledge." :
               "Keep learning! Review the course material and try again when you're ready."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleStart} variant="secondary"><RotateCcw size={14} />Retake Quiz</Button>
              <Link href="/learn"><Button><BookOpen size={14} />Study Topics</Button></Link>
            </div>
          </Card>

          <div className="max-w-xl mx-auto mb-6">
            <h3 className="font-heading font-medium text-[15px] mb-4">Performance by Topic</h3>
            <Card>
              <div className="space-y-3">
                {topicBreakdown.map(({ topic, label, correct, total }) => {
                  const topicPct = Math.round((correct / total) * 100);
                  return (
                    <div key={topic}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] text-text-primary">{label}</span>
                        <span className={cn("text-[12px] font-medium", topicPct >= 80 ? "text-success" : topicPct >= 50 ? "text-warning" : "text-danger")}>
                          {correct}/{total}
                        </span>
                      </div>
                      <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", topicPct >= 80 ? "bg-success" : topicPct >= 50 ? "bg-warning" : "bg-danger")}
                          style={{ width: `${topicPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {wrong.length > 0 && (
            <div className="max-w-xl mx-auto">
              <h3 className="font-heading font-medium text-[15px] mb-4">Questions to Review</h3>
              <div className="space-y-4">
                {wrong.map((qq) => (
                  <Card key={qq.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={qq.difficulty === "hard" ? "danger" : qq.difficulty === "medium" ? "warning" : "default"} className="text-[10px]">
                        {qq.difficulty}
                      </Badge>
                      <span className="text-[11px] text-text-muted">{TOPIC_LABELS[qq.topic] ?? qq.topic}</span>
                    </div>
                    <p className="text-[13px] font-medium text-text-primary mb-2">{qq.question}</p>
                    {answers[qq.idx] !== undefined && (
                      <div className="flex items-start gap-2 mb-1">
                        <XCircle size={14} className="text-danger shrink-0 mt-0.5" />
                        <p className="text-[12px] text-text-muted">Your answer: {qq.options[answers[qq.idx]!]}</p>
                      </div>
                    )}
                    {answers[qq.idx] === undefined && (
                      <div className="flex items-start gap-2 mb-1">
                        <Timer size={14} className="text-warning shrink-0 mt-0.5" />
                        <p className="text-[12px] text-text-muted">Time ran out</p>
                      </div>
                    )}
                    <div className="flex items-start gap-2 mb-2">
                      <CheckCircle2 size={14} className="text-success shrink-0 mt-0.5" />
                      <p className="text-[12px] text-success">Correct: {qq.options[qq.correctIndex]}</p>
                    </div>
                    <p className="text-[12px] text-text-secondary">{qq.explanation}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const timerPct = (timeLeft / SECONDS_PER_QUESTION) * 100;
  const timerColor = timeLeft <= 5 ? "bg-danger" : timeLeft <= 10 ? "bg-warning" : "bg-accent";

  return (
    <div className="min-h-screen">
      <Topbar title="Security Awareness Quiz" breadcrumbs={[{ label: "Tools" }]} />
      <div className="max-w-content mx-auto px-8 py-8">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] text-text-secondary">Question {current + 1} of {totalQ}</p>
            <div className="flex items-center gap-3">
              {streak >= 2 && (
                <div className="flex items-center gap-1 text-warning animate-pulse">
                  <Flame size={14} />
                  <span className="text-[13px] font-medium">{streak}x streak!</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Badge variant={q.difficulty === "hard" ? "danger" : q.difficulty === "medium" ? "warning" : "default"} className="text-[10px]">
                  {q.difficulty}
                </Badge>
              </div>
            </div>
          </div>
          <Progress value={current + 1} max={totalQ} size="sm" className="mb-2" />

          <div className="flex items-center gap-2 mb-6">
            <Timer size={13} className={cn("shrink-0", timeLeft <= 5 ? "text-danger" : timeLeft <= 10 ? "text-warning" : "text-text-muted")} />
            <div className="flex-1 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-1000", timerColor)}
                style={{ width: `${timerPct}%` }}
              />
            </div>
            <span className={cn("text-[12px] font-mono w-6 text-right", timeLeft <= 5 ? "text-danger font-bold" : "text-text-muted")}>
              {timeLeft}
            </span>
          </div>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] text-text-muted">{TOPIC_LABELS[q.topic] ?? q.topic}</span>
            </div>
            <p className="font-heading font-medium text-[15px] mb-6 leading-relaxed">{q.question}</p>
            <div className="space-y-2 mb-6">
              {q.options.map((opt, i) => {
                let cls = "border border-border bg-bg-elevated hover:border-border-focus";
                if (revealed) {
                  if (i === q.correctIndex) cls = "border-success bg-success/10";
                  else if (i === selected) cls = "border-danger bg-danger/10";
                  else cls = "border-border bg-bg-elevated opacity-50";
                }
                return (
                  <button key={i} onClick={() => handleSelect(i)} disabled={revealed}
                    className={cn("w-full text-left px-4 py-3 rounded-input text-[13.5px] transition-colors duration-hover flex items-center gap-3", cls)}>
                    {revealed && i === q.correctIndex && <CheckCircle2 size={16} className="text-success shrink-0" />}
                    {revealed && i === selected && i !== q.correctIndex && <XCircle size={16} className="text-danger shrink-0" />}
                    {!revealed && <span className="w-5 h-5 rounded-full border border-border text-[11px] flex items-center justify-center text-text-muted shrink-0">{String.fromCharCode(65 + i)}</span>}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {revealed && (
              <div className={cn("p-3 rounded-input text-[13px] mb-4",
                timedOut ? "bg-warning/10" :
                selected === q.correctIndex ? "bg-success/10" : "bg-danger/10")}>
                <p className="font-medium mb-1">
                  {timedOut ? "Time's up!" : selected === q.correctIndex ? "Correct!" : "Not quite."}
                  {!timedOut && selected === q.correctIndex && streak >= 3 && ` ${streak}x streak!`}
                </p>
                <p className="text-text-secondary">{q.explanation}</p>
              </div>
            )}

            {revealed && (
              <Button onClick={handleNext} className="w-full">
                {current < totalQ - 1 ? "Next Question" : "See Results"} <ChevronRight size={14} />
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
