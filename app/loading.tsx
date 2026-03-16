import Header from "@/components/header";
import { NavMenu } from "@/components/navbar";
import SkeletonCard from "@/components/skeleton-card";
import React from "react";

export default function Loading() {
  return (
    <div className="w-full min-w-dvw flex flex-col min-h-dvh overflow-hidden">
      <div className="realitive w-full">
        <NavMenu />
      </div>
      <Header />
      <div className="flex flex-col gap-6 justify-center">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 my-8 ">
          {Array.from({ length: 8 }, (k, v) => v).map((item) => (
            <SkeletonCard key={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
