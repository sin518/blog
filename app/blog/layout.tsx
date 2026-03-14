import { NavMenu } from "@/components/navbar";
import React from "react";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full">
      <NavMenu />
      {children}
    </div>
  );
}
