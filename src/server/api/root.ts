import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "@/server/api/routers/user";
import { coursesRouter } from "@/server/api/routers/courses";
import { quizRouter } from "@/server/api/routers/quiz";
import { progressRouter } from "@/server/api/routers/progress";
import { leaderboardRouter } from "@/server/api/routers/leaderboard";

export const appRouter = createTRPCRouter({
  user: userRouter,
  courses: coursesRouter,
  quiz: quizRouter,
  progress: progressRouter,
  leaderboard: leaderboardRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
