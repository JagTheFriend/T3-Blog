import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { addUserDataToComment } from "~/utils/addUserDataToComment";

export const commentRouter = createTRPCRouter({
  getComments: publicProcedure
    .input(z.object({ postId: z.string().min(5) }))
    .query(async ({ ctx, input }) => {
      const comments = await ctx.db.comment.findMany({
        where: {
          postId: input.postId,
        },
      });

      return await addUserDataToComment(comments);
    }),

  createComment: privateProcedure
    .input(
      z.object({
        postId: z.string().min(5),
        content: z.string().min(1),
        authorId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.comment.create({
        data: {
          postId: input.postId,
          content: input.content,
          authorId: input.authorId,
        },
      });
    }),

  deleteComment: privateProcedure
    .input(z.object({ commentId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.comment.delete({
        where: {
          id: input.commentId,
        },
      });
    }),
});
