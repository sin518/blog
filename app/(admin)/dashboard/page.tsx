import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:4000";
  redirect(`${backendUrl}/dashboard`);
}
