import { TRPCError } from "@trpc/server";
import slugify from "slugify";
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
        description: z.string().min(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.create({
        data: {
          title: input.title,
          content: input.content,
          description: input.description,
          slug: slugify(
            `${input.title}_${Math.random().toString().replace("0.", "")}`
          ),
          authorId: ctx.userId,
        },
      });
    }),

  deletePost: privateProcedure
    .input(
      z.object({
        postId: z.string().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.post.delete({
        where: {
          id: input.postId,
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
    });
    return await addUserDataToPost(posts);
  }),

  getPostBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          slug: input.slug,
        },
      });
      if (!post) {
        return new TRPCError({
          code: "NOT_FOUND",
          message: "Post cannot be found",
        });
      }
      return (await addUserDataToPost([post]))[0];
    }),
});
