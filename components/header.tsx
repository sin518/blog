import React from "react";

export default function Header({ about }: { about?: string }) {
  const title = about ? `关于 ${about}` : "最新文章";

  return (
    <div className="container mx-auto flex w-full flex-col gap-3 border-b px-4 py-12 text-center">
      <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
        Blog Archive
      </p>
      <h1 className="text-3xl font-semibold tracking-normal md:text-5xl">
        {title}
      </h1>
      <p className="mx-auto max-w-2xl text-sm leading-6 text-muted-foreground">
        {about
          ? "按主题整理的文章集合，适合快速追踪同一方向的内容。"
          : "技术观察、实践笔记和产品思考，按发布时间持续更新。"}
      </p>
    </div>
  );
}
