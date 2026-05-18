import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Combine } from "lucide-react";

interface CardProps {
  totalCategories: number;
  totalPosts: number;
  totalViews: number;
}

export default function DashboardCard({
  totalCategories,
  totalPosts,
  totalViews,
}: CardProps) {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Card className="flex min-h-32 min-w-0 flex-col justify-center shadow-sm">
        <CardHeader className="flex w-full min-w-0 flex-col gap-3">
          <div className="flex w-full min-w-0 items-center justify-between gap-3">
            <CardDescription className="min-w-0 truncate text-base font-medium sm:text-lg">
              所有分类数
            </CardDescription>
            <Combine className="size-5 shrink-0 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl">
            {totalCategories}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="flex min-h-32 min-w-0 flex-col justify-center shadow-sm">
        <CardHeader className="flex w-full min-w-0 flex-col gap-3">
          <div className="flex w-full min-w-0 items-center justify-between gap-3">
            <CardDescription className="min-w-0 truncate text-base font-medium sm:text-lg">
              帖子总数
            </CardDescription>
            <Combine className="size-5 shrink-0 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl">{totalPosts}</CardTitle>
        </CardHeader>
      </Card>

      <Card className="flex min-h-32 min-w-0 flex-col justify-center shadow-sm sm:col-span-2 xl:col-span-1">
        <CardHeader className="flex w-full min-w-0 flex-col gap-3">
          <div className="flex w-full min-w-0 items-center justify-between gap-3">
            <CardDescription className="min-w-0 truncate text-base font-medium sm:text-lg">
              总浏览量
            </CardDescription>
            <Combine className="size-5 shrink-0 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl">{totalViews}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
