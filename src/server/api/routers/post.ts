import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { addUserDataToPost } from "~/utils/addUserDataToPost";

export const postRouter = createTRPCRouter({
  createPost: privateProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.create({
        data: {
          title: input.title,
          content: input.content,
          authorId: ctx.userId,
        },
      });
    }),

  deletePost: privateProcedure
    .input(
      z.object({
        title: z.string().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.post.deleteMany({
        where: {
          AND: [
            {
              title: input.title,
              authorId: ctx.userId,
            },
          ],
        },
      });
    }),

  deleteAllPostsByAuthor: privateProcedure.mutation(({ ctx }) => {
    return ctx.db.post.deleteMany({
      where: {
        authorId: ctx.userId,
      },
    });
  }),

  getPosts: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 10,
    });
    return await addUserDataToPost(posts);
  }),
});
