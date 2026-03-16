import React from "react";
import { Skeleton } from "./ui/skeleton";

export default function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[140px] w-[360px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[360px] " />
        <Skeleton className="h-4 w-[360px] " />
        <Skeleton className="h-4 w-[360px] " />
      </div>
    </div>
  );
}
