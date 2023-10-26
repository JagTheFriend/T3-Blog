import { clerkClient } from "@clerk/nextjs";
import type { Post } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from ".";

export async function addUserDataToPost(posts: Post[]) {
  const userId = posts.map((post) => post.authorId);

  const users = (
    await clerkClient.users.getUserList({ userId, limit: 110 })
  ).map(filterUserForClient);

  return posts.map((post) => {
    const author = users.find((user) => user.id === post.authorId);
    if (!author) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.authorId}`,
      });
    }
    return {
      post,
      author: {
        ...author,
        username: author.username,
      },
    };
  });
}
