import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Category, User } from "@prisma/client";
import Image from "next/image";
import { getNameInitials } from "@/lib/utils";

interface CategoryProps {
  categories: (Category & { user: User })[];
}

export default function DashboardCategories({ categories }: CategoryProps) {
  return (
    <div className="min-w-0">
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>最近分类</CardTitle>
        </CardHeader>
        <CardContent className="flex min-w-0 flex-col gap-3">
          {categories.length ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="flex min-w-0 flex-col gap-3 rounded-lg border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="min-w-0 truncate font-medium">
                  {category.name}
                </p>
                <div className="flex min-w-0 items-center gap-2">
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-xs font-semibold text-white shadow-sm">
                    {category.user?.image ? (
                      <Image
                        className="rounded-full object-cover"
                        src={category.user.image}
                        alt={category.user?.name ?? "avatar"}
                        fill
                        unoptimized
                        sizes="32px"
                      />
                    ) : (
                      <span className="uppercase">
                        {getNameInitials(category.user?.name ?? "?") || "?"}
                      </span>
                    )}
                  </div>
                  <p className="min-w-0 truncate text-sm font-medium">
                    {category.user?.name}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              暂无分类
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
