import type { User } from "@clerk/nextjs/dist/types/server";

export function filterUserForClient(user: User) {
  return {
    id: user.id,
    username: user.username ?? "Unknown",
    profileImageUrl: user.imageUrl,
  };
}
