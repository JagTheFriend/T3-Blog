import { clerkClient } from "@clerk/nextjs";
import type { Comment } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from ".";

export async function addUserDataToComment(comments: Comment[]) {
  const userId = comments.map((comment) => comment.authorId);

  const users = (
    await clerkClient.users.getUserList({ userId, limit: 110 })
  ).map(filterUserForClient);

  return comments.map((comment) => {
    const author = users.find((user) => user.id === comment.authorId);
    if (!author) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for comment not found. COMMENT ID: ${comment.id}, USER ID: ${comment.authorId}`,
      });
    }
    return {
      comment,
      author: {
        ...author,
        username: author.username,
      },
    };
  });
}
