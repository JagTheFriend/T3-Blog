import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/trpc/comment.getComments",
    "/api/trpc/post.getPosts",
    "/api/trpc/post.getPostBySlug",
    "/api/trpc/post.getPostBySlug,comment.getComments",
    "/api/trpc/post.getPostByUserId",
    "/api/trpc/user.getUserById",
    "/api/trpc/post.getPostByUserId,user.getUserById",
    "/post/(.*)",
    "/profile",
    "/profile/(.*)",
  ],
});
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
