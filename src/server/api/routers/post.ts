import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  createPost: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(10),
        authorId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.create({
        data: {
          title: input.title,
          content: input.content,
          authorId: input.authorId,
        },
      });
    }),

  deletePost: publicProcedure
    .input(
      z.object({
        authorId: z.string(),
        title: z.string().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.post.deleteMany({
        where: {
          AND: [
            {
              title: input.title,
              authorId: input.authorId,
            },
          ],
        },
      });
    }),

  deleteAllPostsByAuthor: publicProcedure
    .input(z.object({ authorId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.post.deleteMany({
        where: {
          authorId: input.authorId,
        },
      });
    }),

  getPosts: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),
});
