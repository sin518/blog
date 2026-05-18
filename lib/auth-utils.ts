import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { cache } from "react";

export const authSession = cache(async () => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    return session;
  } catch (err) {
    console.error("Authentication failed:", err);
    return null;
  }
});

export const requireAuth = async () => {
  const session = await authSession();
  if (!session) {
    redirect("/sign-in");
  }
  return session;
};

export const requireNoAuth = async () => {
  const session = await authSession();
  if (session) {
    redirect("/");
  }
  return session;
};
