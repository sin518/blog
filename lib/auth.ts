import prisma from "@/lib/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

const authSecret =
  process.env.BETTER_AUTH_SECRET ??
  "build-time-fallback-secret-change-me-in-production";

if (!process.env.BETTER_AUTH_SECRET) {
  console.warn(
    "BETTER_AUTH_SECRET is not set. Using fallback secret for build/runtime; please set it in production.",
  );
}

export const auth = betterAuth({
  secret: authSecret,
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  //邮箱+密码登录方式
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      prompt: "select_account",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: "select_account",
    },
  },
  plugins: [nextCookies()],
});
