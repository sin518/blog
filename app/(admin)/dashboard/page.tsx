import React from "react";
import { authSession, requireAuth } from "@/lib/auth-utils";
import Link from "next/link";
import { Rocket } from "lucide-react";
import DashboardCard from "@/components/dashboard-card";
import DashboardChart from "@/components/dashboard-chart";
import { getPostsByUser } from "@/app/actions/posts";
import { getCategories } from "@/app/actions/categories";
import DashboardCategories from "@/components/dashboard-categories";

export default async function DashboardPage() {
  await requireAuth();

  const session = await authSession();
  const posts = await getPostsByUser();
  const categories = await getCategories();
  const totalViews = posts.reduce((acc, post) => acc + post.views!, 0);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-wrap w-full flex-col gap-6 p-14 px-6 ">
        <Link
          href="/"
          className="text-blue-600 font-medium gap-2 items-center flex"
        >
          <span>返回首页</span>
          <Rocket />
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-2xl">Hi,{session?.user.name}</h1>
          <a
            href="/users"
            className="rounded-full border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50"
          >
            用户管理
          </a>
        </div>
      </div>
      <div className="container flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <DashboardCard
            totalPosts={posts.length}
            totalCategories={categories.length}
            totalViews={totalViews}
          />
        </div>
        <div className="px-4 md:px-6 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            <DashboardChart data={posts} />
            <DashboardCategories categories={categories} />
          </div>
        </div>
      </div>
    </div>
  );
}
