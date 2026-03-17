import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const progressRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [user, lessonsCompleted, coursesStarted] = await Promise.all([
      ctx.db.user.findUnique({ where: { id: ctx.session.user.id } }),
      ctx.db.completedLesson.count({
        where: { userId: ctx.session.user.id },
      }),
      ctx.db.courseProgress.count({
        where: { userId: ctx.session.user.id },
      }),
    ]);
    return {
      xp: user?.xp ?? 0,
      level: user?.level ?? 1,
      levelName: user?.levelName ?? "Rookie",
      streak: user?.streak ?? 0,
      rank: user?.rank ?? "Unranked",
      lessonsCompleted,
      coursesStarted,
    };
  }),

  getBadges: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.earnedBadge.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),

  getCompletedLessons: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.completedLesson.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { completedAt: "desc" },
    });
  }),

  getStreakCalendar: protectedProcedure.query(async ({ ctx }) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activities = await ctx.db.activity.findMany({
      where: {
        userId: ctx.session.user.id,
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { createdAt: true },
    });

    const calendar: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0]!;
      calendar[key] = 0;
    }

    for (const a of activities) {
      const key = a.createdAt.toISOString().split("T")[0]!;
      if (calendar[key] !== undefined) {
        calendar[key]++;
      }
    }

    return calendar;
  }),

  earnBadge: protectedProcedure
    .input(z.object({ badgeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const badge = await ctx.db.earnedBadge.upsert({
        where: {
          userId_badgeId: {
            userId: ctx.session.user.id,
            badgeId: input.badgeId,
          },
        },
        update: {},
        create: { userId: ctx.session.user.id, badgeId: input.badgeId },
      });

      await ctx.db.activity.create({
        data: {
          userId: ctx.session.user.id,
          type: "badge_earned",
          label: "Earned a new badge",
        },
      });

      return badge;
    }),
});
