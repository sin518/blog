import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { RocketIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RocketIcon className="text-9xl" size={400} />
        </EmptyMedia>
        <EmptyTitle className="text-9xl font-semibold">404</EmptyTitle>
        <EmptyDescription>页面不存在</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Link href="/">
            <Button className="cursor-pointer">返回首页</Button>
          </Link>
        </div>
      </EmptyContent>
    </Empty>
  );
}
