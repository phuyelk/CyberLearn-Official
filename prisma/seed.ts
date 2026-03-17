import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@cyberlearn.dev" },
    update: {},
    create: {
      name: "Alex Chen",
      email: "demo@cyberlearn.dev",
      password: hashedPassword,
      xp: 1250,
      level: 3,
      levelName: "Analyst",
      streak: 7,
      rank: "Top 15%",
    },
  });

  await prisma.userPreference.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      emailReminders: true,
      darkModeLock: true,
    },
  });

  const courseProgressData = [
    { courseSlug: "introduction-to-cybersecurity", progress: 100 },
    { courseSlug: "how-phishing-works", progress: 100 },
    { courseSlug: "password-security", progress: 100 },
    { courseSlug: "social-engineering-tactics", progress: 40 },
    { courseSlug: "safe-browsing-habits", progress: 20 },
  ];

  for (const cp of courseProgressData) {
    await prisma.courseProgress.upsert({
      where: {
        userId_courseSlug: { userId: user.id, courseSlug: cp.courseSlug },
      },
      update: { progress: cp.progress },
      create: {
        userId: user.id,
        courseSlug: cp.courseSlug,
        progress: cp.progress,
      },
    });
  }

  const completedLessonsData = [
    { courseSlug: "introduction-to-cybersecurity", lessonSlug: "what-is-cybersecurity" },
    { courseSlug: "introduction-to-cybersecurity", lessonSlug: "types-of-cyber-threats" },
    { courseSlug: "introduction-to-cybersecurity", lessonSlug: "building-good-security-habits" },
    { courseSlug: "how-phishing-works", lessonSlug: "anatomy-of-phishing" },
    { courseSlug: "how-phishing-works", lessonSlug: "types-of-phishing" },
    { courseSlug: "how-phishing-works", lessonSlug: "phishing-protection" },
    { courseSlug: "password-security", lessonSlug: "strong-passwords" },
    { courseSlug: "password-security", lessonSlug: "password-managers" },
    { courseSlug: "social-engineering-tactics", lessonSlug: "understanding-social-engineering" },
  ];

  for (const cl of completedLessonsData) {
    await prisma.completedLesson.upsert({
      where: { userId_lessonSlug: { userId: user.id, lessonSlug: cl.lessonSlug } },
      update: {},
      create: {
        userId: user.id,
        courseSlug: cl.courseSlug,
        lessonSlug: cl.lessonSlug,
      },
    });
  }

  const badgesData = ["first-lesson", "password-pro", "phishing-spotter", "streak-3"];
  for (const badgeId of badgesData) {
    await prisma.earnedBadge.upsert({
      where: { userId_badgeId: { userId: user.id, badgeId } },
      update: {},
      create: { userId: user.id, badgeId },
    });
  }

  await prisma.quizResult.create({
    data: { userId: user.id, score: 8, totalQuestions: 10 },
  });

  const activities = [
    { type: "lesson_complete", label: "Completed: Intro to Phishing" },
    { type: "badge_earned", label: "Earned badge: Phishing Spotter" },
    { type: "lesson_complete", label: "Completed: Password Security" },
    { type: "badge_earned", label: "Earned badge: Password Pro" },
    { type: "quiz_complete", label: "Scored 8/10 on Security Quiz" },
    { type: "lesson_complete", label: "Started: Social Engineering" },
    { type: "xp_gained", label: "Earned 50 XP" },
    { type: "lesson_complete", label: "Completed: Intro to Cybersecurity" },
  ];

  for (const act of activities) {
    await prisma.activity.create({
      data: { userId: user.id, type: act.type, label: act.label },
    });
  }

  console.log("Seed complete. Demo user: demo@cyberlearn.dev / password123");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
