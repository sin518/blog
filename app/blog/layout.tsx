import { NavMenu } from "@/components/navbar";
import { authSession } from "@/lib/auth-utils";
import prisma from "@/lib/db";
import React from "react";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await authSession();
  const user = session
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
      })
    : null;

  return (
    <div className="relative w-full">
      <NavMenu
        userName={user?.name ?? session?.user.name ?? "访客"}
        userImage={user?.image ?? session?.user.image ?? ""}
      />
      {children}
    </div>
  );
}
