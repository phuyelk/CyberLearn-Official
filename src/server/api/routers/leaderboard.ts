import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getLevel } from "@/lib/level";

export const leaderboardRouter = createTRPCRouter({
  getLeaderboard: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany({
      orderBy: { xp: "desc" },
      select: {
        id: true,
        name: true,
        image: true,
        xp: true,
        streak: true,
        rank: true,
        createdAt: true,
      },
      take: 50,
    });

    return users.map((user, index) => {
      const lvl = getLevel(user.xp);
      return {
        position: index + 1,
        id: user.id,
        name: user.name ?? "Anonymous",
        image: user.image,
        xp: user.xp,
        level: lvl.level,
        levelName: lvl.levelName,
        streak: user.streak,
        rank: user.rank,
        isCurrentUser: user.id === ctx.session.user.id,
        joinedAt: user.createdAt,
      };
    });
  }),

  getMyRank: protectedProcedure.query(async ({ ctx }) => {
    const currentUser = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { xp: true },
    });

    if (!currentUser) return { position: 0, total: 0 };

    const usersAbove = await ctx.db.user.count({
      where: { xp: { gt: currentUser.xp } },
    });

    const total = await ctx.db.user.count();

    return {
      position: usersAbove + 1,
      total,
    };
  }),
});
