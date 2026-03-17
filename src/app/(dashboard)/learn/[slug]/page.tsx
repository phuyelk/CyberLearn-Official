"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/ui/callout";
import { Progress } from "@/components/ui/progress";
import { api } from "@/trpc/react";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, ChevronRight, Copy, Check, ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { courses, type ContentBlock, type ScenarioChoice } from "@/data/courses";

function InlineQuiz({ question, options, correctIndex, explanation }: {
  question: string; options: string[]; correctIndex: number; explanation: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const isCorrect = selected === correctIndex;

  return (
    <div className="my-6 border border-border rounded-card bg-bg-panel p-5">
      <p className="font-heading font-medium text-[14px] mb-4">{question}</p>
      <div className="space-y-2">
        {options.map((opt, i) => {
          let cls = "border border-border bg-bg-elevated hover:border-border-focus";
          if (answered) {
            if (i === correctIndex) cls = "border-success bg-success/10";
            else if (i === selected) cls = "border-danger bg-danger/10";
            else cls = "border-border bg-bg-elevated opacity-50";
          }
          return (
            <button key={i} onClick={() => !answered && setSelected(i)} disabled={answered}
              className={cn("w-full text-left px-4 py-2.5 rounded-input text-[13.5px] transition-colors duration-hover flex items-center gap-3", cls)}>
              {answered && i === correctIndex && <CheckCircle2 size={16} className="text-success shrink-0" />}
              {answered && i === selected && i !== correctIndex && <XCircle size={16} className="text-danger shrink-0" />}
              {!answered && <span className="w-5 h-5 rounded-full border border-border text-[11px] flex items-center justify-center text-text-muted shrink-0">{String.fromCharCode(65 + i)}</span>}
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={cn("mt-4 p-3 rounded-input text-[13px]", isCorrect ? "bg-success/10 text-success" : "bg-danger/10 text-text-secondary")}>
          <p className="font-medium mb-1">{isCorrect ? "Correct!" : "Not quite."}</p>
          <p className="text-text-secondary">{explanation}</p>
        </div>
      )}
    </div>
  );
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="my-6 rounded-card border border-border overflow-hidden bg-[#0d1117]">
      <div className="flex items-center justify-between px-4 py-2 bg-bg-elevated border-b border-border">
        {language && <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted">{language}</span>}
        {!language && <span />}
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-[11px] text-text-muted hover:text-text-primary transition-colors">
          {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-[#e6edf3]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function MultiSelectQuiz({ question, options, correctIndices, explanation }: {
  question: string; options: string[]; correctIndices: number[]; explanation: string;
}) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const correctSet = useMemo(() => new Set(correctIndices), [correctIndices]);
  const isFullyCorrect = submitted && selected.size === correctSet.size && [...selected].every(i => correctSet.has(i));

  const toggle = (i: number) => {
    if (submitted) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <div className="my-6 border border-border rounded-card bg-bg-panel p-5">
      <div className="flex items-center gap-2 mb-4">
        <p className="font-heading font-medium text-[14px]">{question}</p>
        <Badge variant="accent" className="text-[10px] shrink-0">Select all that apply</Badge>
      </div>
      <div className="space-y-2">
        {options.map((opt, i) => {
          let cls = "border border-border bg-bg-elevated hover:border-border-focus";
          if (submitted) {
            if (correctSet.has(i) && selected.has(i)) cls = "border-success bg-success/10";
            else if (correctSet.has(i) && !selected.has(i)) cls = "border-warning bg-warning/10";
            else if (!correctSet.has(i) && selected.has(i)) cls = "border-danger bg-danger/10";
            else cls = "border-border bg-bg-elevated opacity-50";
          }
          return (
            <button key={i} onClick={() => toggle(i)} disabled={submitted}
              className={cn("w-full text-left px-4 py-2.5 rounded-input text-[13.5px] transition-colors duration-hover flex items-center gap-3", cls)}>
              <span className={cn("w-4 h-4 rounded-[3px] border flex items-center justify-center shrink-0 transition-colors",
                !submitted && selected.has(i) ? "bg-accent border-accent" : "border-border",
                submitted && correctSet.has(i) ? "bg-success border-success" : "",
                submitted && !correctSet.has(i) && selected.has(i) ? "bg-danger border-danger" : "")}>
                {((!submitted && selected.has(i)) || (submitted && (selected.has(i) || correctSet.has(i)))) && <Check size={10} className="text-white" />}
              </span>
              <span>{opt}</span>
              {submitted && correctSet.has(i) && !selected.has(i) && <span className="ml-auto text-[11px] text-warning">Missed</span>}
            </button>
          );
        })}
      </div>
      {!submitted && (
        <Button size="sm" onClick={() => setSubmitted(true)} disabled={selected.size === 0} className="mt-4">
          Check Answers
        </Button>
      )}
      {submitted && (
        <div className={cn("mt-4 p-3 rounded-input text-[13px]", isFullyCorrect ? "bg-success/10 text-success" : "bg-danger/10 text-text-secondary")}>
          <p className="font-medium mb-1">{isFullyCorrect ? "All correct!" : `${[...selected].filter(i => correctSet.has(i)).length} of ${correctSet.size} correct.`}</p>
          <p className="text-text-secondary">{explanation}</p>
        </div>
      )}
    </div>
  );
}

function OrderExercise({ question, items, explanation }: {
  question: string; items: string[]; explanation: string;
}) {
  const shuffled = useMemo(() => {
    const arr = items.map((item, correctIdx) => ({ item, correctIdx }));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j]!, arr[i]!];
    }
    if (arr.every((a, idx) => a.correctIdx === idx)) {
      [arr[0], arr[arr.length - 1]] = [arr[arr.length - 1]!, arr[0]!];
    }
    return arr;
  }, [items]);

  const [order, setOrder] = useState(shuffled);
  const [checked, setChecked] = useState(false);
  const isCorrect = checked && order.every((o, idx) => o.correctIdx === idx);

  const move = (from: number, to: number) => {
    if (checked || to < 0 || to >= order.length) return;
    const next = [...order];
    [next[from], next[to]] = [next[to]!, next[from]!];
    setOrder(next);
  };

  return (
    <div className="my-6 border border-border rounded-card bg-bg-panel p-5">
      <p className="font-heading font-medium text-[14px] mb-4">{question}</p>
      <div className="space-y-1.5">
        {order.map((entry, i) => {
          let cls = "border border-border bg-bg-elevated";
          if (checked) {
            cls = entry.correctIdx === i ? "border-success bg-success/10" : "border-danger bg-danger/10";
          }
          return (
            <div key={entry.correctIdx} className={cn("flex items-center gap-2 px-4 py-2.5 rounded-input text-[13.5px] transition-colors", cls)}>
              <span className="w-5 h-5 rounded-full bg-bg-app text-[11px] flex items-center justify-center text-text-muted shrink-0 font-mono">{i + 1}</span>
              <span className="flex-1">{entry.item}</span>
              {!checked && (
                <div className="flex items-center gap-0.5">
                  <button onClick={() => move(i, i - 1)} disabled={i === 0}
                    className="p-1 rounded hover:bg-bg-app disabled:opacity-30 text-text-muted hover:text-text-primary transition-colors">
                    <ArrowUp size={14} />
                  </button>
                  <button onClick={() => move(i, i + 1)} disabled={i === order.length - 1}
                    className="p-1 rounded hover:bg-bg-app disabled:opacity-30 text-text-muted hover:text-text-primary transition-colors">
                    <ArrowDown size={14} />
                  </button>
                </div>
              )}
              {checked && entry.correctIdx === i && <CheckCircle2 size={14} className="text-success shrink-0" />}
              {checked && entry.correctIdx !== i && <XCircle size={14} className="text-danger shrink-0" />}
            </div>
          );
        })}
      </div>
      {!checked && (
        <Button size="sm" onClick={() => setChecked(true)} className="mt-4">Check Order</Button>
      )}
      {checked && (
        <div className={cn("mt-4 p-3 rounded-input text-[13px]", isCorrect ? "bg-success/10 text-success" : "bg-danger/10 text-text-secondary")}>
          <p className="font-medium mb-1">{isCorrect ? "Perfect order!" : "Not quite right."}</p>
          {!isCorrect && <p className="text-text-muted text-[12px] mb-1">Correct order: {items.map((item, i) => `${i + 1}. ${item}`).join(" → ")}</p>}
          <p className="text-text-secondary">{explanation}</p>
        </div>
      )}
    </div>
  );
}

function ScenarioBlock({ setup, choices }: { setup: string; choices: ScenarioChoice[] }) {
  const [revealed, setRevealed] = useState<number | null>(null);

  return (
    <div className="my-6 border border-accent/30 rounded-card bg-accent-soft p-5">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={15} className="text-accent" />
        <span className="text-[12px] font-medium uppercase tracking-wider text-accent">Scenario</span>
      </div>
      <p className="text-text-secondary text-body leading-relaxed mb-4">{renderText(setup)}</p>
      <p className="text-[12px] font-medium text-text-muted mb-2">What would you do?</p>
      <div className="space-y-2">
        {choices.map((choice, i) => {
          const isRevealed = revealed === i;
          const wasOtherRevealed = revealed !== null && revealed !== i;
          return (
            <div key={i}>
              <button onClick={() => revealed === null && setRevealed(i)} disabled={revealed !== null}
                className={cn("w-full text-left px-4 py-2.5 rounded-input text-[13.5px] transition-all duration-hover border",
                  isRevealed && choice.isCorrect ? "border-success bg-success/10" :
                  isRevealed && !choice.isCorrect ? "border-danger bg-danger/10" :
                  wasOtherRevealed ? "border-border bg-bg-elevated opacity-50" :
                  "border-border bg-bg-panel hover:border-border-focus")}>
                {choice.text}
              </button>
              {isRevealed && (
                <div className={cn("mt-1 ml-4 p-3 rounded-input text-[13px]", choice.isCorrect ? "bg-success/10 text-success" : "bg-danger/10 text-text-secondary")}>
                  <p className="font-medium mb-1">{choice.isCorrect ? "Good call." : "Risky choice."}</p>
                  <p className="text-text-secondary">{choice.outcome}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {revealed !== null && !choices[revealed]?.isCorrect && (
        <div className="mt-3 p-3 rounded-input bg-success/5 border border-success/20 text-[13px]">
          <p className="font-medium text-success mb-1">Better approach:</p>
          <p className="text-text-secondary">{choices.find(c => c.isCorrect)?.outcome}</p>
        </div>
      )}
    </div>
  );
}

function FillBlankQuiz({ question, answer, acceptedAnswers, hint, explanation }: {
  question: string; answer: string; acceptedAnswers?: string[]; hint?: string; explanation: string;
}) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const allAccepted = useMemo(() => [answer, ...(acceptedAnswers ?? [])].map(a => a.toLowerCase().trim()), [answer, acceptedAnswers]);
  const isCorrect = submitted && allAccepted.includes(input.toLowerCase().trim());

  const handleSubmit = () => {
    if (input.trim()) setSubmitted(true);
  };

  return (
    <div className="my-6 border border-border rounded-card bg-bg-panel p-5">
      <p className="font-heading font-medium text-[14px] mb-3">{question}</p>
      {hint && !submitted && <p className="text-[12px] text-text-muted mb-3">Hint: {hint}</p>}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => !submitted && setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !submitted && handleSubmit()}
          disabled={submitted}
          placeholder="Type your answer..."
          className={cn(
            "flex-1 px-3 py-2 rounded-input text-[13.5px] bg-bg-elevated border outline-none transition-colors",
            submitted && isCorrect ? "border-success text-success" :
            submitted && !isCorrect ? "border-danger text-danger" :
            "border-border focus:border-border-focus text-text-primary"
          )}
        />
        {!submitted && (
          <Button size="sm" onClick={handleSubmit} disabled={!input.trim()}>Submit</Button>
        )}
      </div>
      {submitted && (
        <div className={cn("mt-4 p-3 rounded-input text-[13px]", isCorrect ? "bg-success/10 text-success" : "bg-danger/10 text-text-secondary")}>
          <p className="font-medium mb-1">{isCorrect ? "Correct!" : `Not quite. The answer is "${answer}".`}</p>
          <p className="text-text-secondary">{explanation}</p>
        </div>
      )}
    </div>
  );
}

function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-medium text-text-primary">{part.slice(2, -2)}</strong>;
    return part.split("\n\n").map((line, j) => (
      <span key={`${i}-${j}`}>{j > 0 && <><br /><br /></>}{line}</span>
    ));
  });
}

export default function LessonPage() {
  const params = useParams();
  const slug = params.slug as string;
  const course = courses.find((c) => c.slug === slug);
  const [lessonIdx, setLessonIdx] = useState(0);

  const utils = api.useUtils();
  const { data: courseProgress } = api.courses.getBySlug.useQuery({ slug });
  const completeLessonMut = api.courses.completeLesson.useMutation({
    onSuccess: () => { utils.courses.getBySlug.invalidate({ slug }); },
  });
  const startCourseMut = api.courses.startCourse.useMutation();

  useEffect(() => {
    if (course) startCourseMut.mutate({ courseSlug: course.slug });
  }, [course?.slug]);

  if (!course) {
    return (
      <div className="min-h-screen">
        <Topbar title="Course Not Found" />
        <div className="max-w-content mx-auto px-8 py-16 text-center">
          <p className="text-text-secondary text-body mb-4">We couldn&apos;t find this course.</p>
          <Link href="/learn"><Button variant="secondary">Browse Courses</Button></Link>
        </div>
      </div>
    );
  }

  const lesson = course.lessons[lessonIdx]!;
  const completedSlugs = new Set(courseProgress?.completedLessons.map((cl) => cl.lessonSlug) ?? []);
  const isLessonDone = completedSlugs.has(lesson.slug);

  const handleComplete = () => {
    completeLessonMut.mutate({ courseSlug: course.slug, lessonSlug: lesson.slug, totalLessons: course.lessonCount });
  };

  const goTo = (idx: number) => { setLessonIdx(idx); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="min-h-screen">
      <Topbar title={course.title} breadcrumbs={[{ label: "Courses" }, { label: course.title }]} />
      <div className="max-w-content mx-auto px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="accent">{course.category}</Badge>
              <Badge>{course.difficulty}</Badge>
              <span className="text-[13px] text-text-muted">Lesson {lessonIdx + 1} of {course.lessons.length}</span>
            </div>
            <h2 className="font-heading text-[24px] font-semibold tracking-tight mb-6">{lesson.title}</h2>
            <div className="space-y-4">
              {lesson.content.map((block: ContentBlock, i: number) => {
                const key = `${lessonIdx}-${i}`;
                if (block.type === "text") return <div key={key} className="text-text-secondary text-body leading-relaxed">{renderText(block.value ?? "")}</div>;
                if (block.type === "callout") return <Callout key={key} variant={block.variant ?? "info"} title={block.title}>{block.value}</Callout>;
                if (block.type === "quiz") return <InlineQuiz key={key} question={block.question ?? ""} options={block.options ?? []} correctIndex={block.correctIndex ?? 0} explanation={block.explanation ?? ""} />;
                if (block.type === "code") return <CodeBlock key={key} code={block.value ?? ""} language={block.language} />;
                if (block.type === "multi-quiz") return <MultiSelectQuiz key={key} question={block.question ?? ""} options={block.options ?? []} correctIndices={block.correctIndices ?? []} explanation={block.explanation ?? ""} />;
                if (block.type === "order") return <OrderExercise key={key} question={block.question ?? ""} items={block.items ?? []} explanation={block.explanation ?? ""} />;
                if (block.type === "scenario") return <ScenarioBlock key={key} setup={block.setup ?? ""} choices={block.choices ?? []} />;
                if (block.type === "fill-blank") return <FillBlankQuiz key={key} question={block.question ?? ""} answer={block.answer ?? ""} acceptedAnswers={block.acceptedAnswers} hint={block.hint} explanation={block.explanation ?? ""} />;
                return null;
              })}
            </div>
          </div>

          <aside className="w-56 shrink-0">
            <div className="sticky top-8">
              <Card className="p-4">
                <h3 className="text-[12px] font-medium uppercase tracking-[0.08em] text-text-muted mb-3">Lesson Outline</h3>
                <div className="space-y-1">
                  {course.lessons.map((l, i) => {
                    const done = completedSlugs.has(l.slug);
                    return (
                      <button key={i} onClick={() => goTo(i)}
                        className={cn("w-full text-left px-2 py-1.5 rounded-badge text-[12.5px] flex items-center gap-2 transition-colors duration-hover",
                          i === lessonIdx ? "bg-accent-soft text-accent" : "text-text-secondary hover:text-text-primary")}>
                        {done ? <CheckCircle2 size={13} className="text-success shrink-0" /> : <ChevronRight size={13} className="shrink-0 text-text-muted" />}
                        <span className="truncate">{l.title}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <Progress value={completedSlugs.size} max={course.lessons.length} size="sm" className="mb-2" />
                  <p className="text-[11px] text-text-muted">{completedSlugs.size} of {course.lessons.length} complete</p>
                </div>
              </Card>
            </div>
          </aside>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <div>{lessonIdx > 0 && <Button variant="ghost" onClick={() => goTo(lessonIdx - 1)}><ArrowLeft size={16} />Previous</Button>}</div>
          <div className="flex items-center gap-3">
            {!isLessonDone && (
              <Button onClick={handleComplete} disabled={completeLessonMut.isPending}>
                <CheckCircle2 size={16} />{completeLessonMut.isPending ? "Saving..." : "Mark Complete"}
              </Button>
            )}
            {isLessonDone && <Badge variant="success">Completed</Badge>}
            {lessonIdx < course.lessons.length - 1 && (
              <Button variant="secondary" onClick={() => goTo(lessonIdx + 1)}>Next <ArrowRight size={16} /></Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
