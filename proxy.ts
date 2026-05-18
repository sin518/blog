import { NextResponse } from "next/server";

export function proxy() {
  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:4000";
  return NextResponse.redirect(new URL("/dashboard", backendUrl));
}

export const config = {
  matcher: "/dashboard",
};
