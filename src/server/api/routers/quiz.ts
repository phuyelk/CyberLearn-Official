import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const quizRouter = createTRPCRouter({
  submitResult: protectedProcedure
    .input(
      z.object({
        score: z.number(),
        totalQuestions: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const xpEarned = input.score * 10;

      const [result] = await Promise.all([
        ctx.db.quizResult.create({
          data: {
            userId: ctx.session.user.id,
            score: input.score,
            totalQuestions: input.totalQuestions,
          },
        }),
        ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { xp: { increment: xpEarned } },
        }),
        ctx.db.activity.create({
          data: {
            userId: ctx.session.user.id,
            type: "quiz_complete",
            label: `Scored ${input.score}/${input.totalQuestions} on Security Quiz`,
          },
        }),
      ]);

      if (input.score === input.totalQuestions) {
        await ctx.db.earnedBadge.upsert({
          where: {
            userId_badgeId: {
              userId: ctx.session.user.id,
              badgeId: "quiz-master",
            },
          },
          update: {},
          create: { userId: ctx.session.user.id, badgeId: "quiz-master" },
        });
      }

      return result;
    }),

  getResults: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.quizResult.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { completedAt: "desc" },
    });
  }),
});
