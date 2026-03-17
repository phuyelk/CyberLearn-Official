import { z } from "zod";
import bcrypt from "bcryptjs";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      if (exists) throw new Error("Email already in use");

      const hashed = await bcrypt.hash(input.password, 12);
      const user = await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashed,
          preferences: { create: {} },
        },
      });
      return { id: user.id, email: user.email };
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: { preferences: true },
    });
    return user;
  }),

  updateProfile: protectedProcedure
    .input(z.object({ name: z.string().min(1), email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { name: input.name, email: input.email },
      });
    }),

  updatePreferences: protectedProcedure
    .input(
      z.object({
        emailReminders: z.boolean().optional(),
        darkModeLock: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.userPreference.upsert({
        where: { userId: ctx.session.user.id },
        update: input,
        create: { userId: ctx.session.user.id, ...input },
      });
    }),

  getActivity: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.activity.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  }),

  getWeeklyXp: protectedProcedure.query(async ({ ctx }) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    const activities = await ctx.db.activity.findMany({
      where: {
        userId: ctx.session.user.id,
        createdAt: { gte: monday },
      },
    });

    return days.map((day, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const count = activities.filter((a) => {
        const d = new Date(a.createdAt);
        return d.toDateString() === date.toDateString();
      }).length;
      return { day, xp: count * 50 };
    });
  }),

  updateAvatar: protectedProcedure
    .input(z.object({ image: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { image: input.image },
      });
    }),

  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });
      if (!user?.password) throw new Error("No password set");

      const isValid = await bcrypt.compare(input.currentPassword, user.password);
      if (!isValid) throw new Error("Current password is incorrect");

      const hashed = await bcrypt.hash(input.newPassword, 12);
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { password: hashed },
      });
      return { success: true };
    }),
});
