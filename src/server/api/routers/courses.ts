import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const coursesRouter = createTRPCRouter({
  getAllProgress: protectedProcedure.query(async ({ ctx }) => {
    const [courseProgress, completedLessons] = await Promise.all([
      ctx.db.courseProgress.findMany({
        where: { userId: ctx.session.user.id },
      }),
      ctx.db.completedLesson.findMany({
        where: { userId: ctx.session.user.id },
      }),
    ]);
    return { courseProgress, completedLessons };
  }),

  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const [progress, completedLessons] = await Promise.all([
        ctx.db.courseProgress.findUnique({
          where: {
            userId_courseSlug: {
              userId: ctx.session.user.id,
              courseSlug: input.slug,
            },
          },
        }),
        ctx.db.completedLesson.findMany({
          where: {
            userId: ctx.session.user.id,
            courseSlug: input.slug,
          },
        }),
      ]);
      return { progress, completedLessons };
    }),

  startCourse: protectedProcedure
    .input(z.object({ courseSlug: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.courseProgress.upsert({
        where: {
          userId_courseSlug: {
            userId: ctx.session.user.id,
            courseSlug: input.courseSlug,
          },
        },
        update: {},
        create: {
          userId: ctx.session.user.id,
          courseSlug: input.courseSlug,
          progress: 0,
        },
      });
    }),

  updateProgress: protectedProcedure
    .input(z.object({ courseSlug: z.string(), progress: z.number().min(0).max(100) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.courseProgress.upsert({
        where: {
          userId_courseSlug: {
            userId: ctx.session.user.id,
            courseSlug: input.courseSlug,
          },
        },
        update: { progress: input.progress },
        create: {
          userId: ctx.session.user.id,
          courseSlug: input.courseSlug,
          progress: input.progress,
        },
      });
    }),

  completeLesson: protectedProcedure
    .input(
      z.object({
        courseSlug: z.string(),
        lessonSlug: z.string(),
        totalLessons: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.completedLesson.findUnique({
        where: {
          userId_lessonSlug: {
            userId: ctx.session.user.id,
            lessonSlug: input.lessonSlug,
          },
        },
      });
      if (existing) return existing;

      const [lesson] = await Promise.all([
        ctx.db.completedLesson.create({
          data: {
            userId: ctx.session.user.id,
            courseSlug: input.courseSlug,
            lessonSlug: input.lessonSlug,
          },
        }),
        ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { xp: { increment: 50 } },
        }),
        ctx.db.activity.create({
          data: {
            userId: ctx.session.user.id,
            type: "lesson_complete",
            label: `Completed a lesson`,
          },
        }),
      ]);

      const completedCount = await ctx.db.completedLesson.count({
        where: {
          userId: ctx.session.user.id,
          courseSlug: input.courseSlug,
        },
      });

      const progress = Math.round((completedCount / input.totalLessons) * 100);
      await ctx.db.courseProgress.upsert({
        where: {
          userId_courseSlug: {
            userId: ctx.session.user.id,
            courseSlug: input.courseSlug,
          },
        },
        update: { progress },
        create: {
          userId: ctx.session.user.id,
          courseSlug: input.courseSlug,
          progress,
        },
      });

      return lesson;
    }),
});
