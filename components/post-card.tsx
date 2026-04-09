"use client";
import { Category, Post } from "@prisma/client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import { MoveRight } from "lucide-react";
import { stripHtml } from "@/lib/utils";

interface PostProps {
  post: Post & { category: Category | null } & {
    user: {
      name: string;
      id: string;
      image: string | null;
      savedPosts: string[];
    };
  };
}

export default function PostCard({ post }: PostProps) {
  const excerpt = stripHtml(post.content);

  return (
    <Card className="w-full p-0 pb-4 border-0 shadow-md gap-1 relative">
      <div className="relative h-60 bg-slate-200 overflow-hidden rounded-sm">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            unoptimized
            className="rounded-sm object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="eager"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            无封面图片
          </div>
        )}
      </div>
      <CardHeader className="gap-0">
        <CardTitle className="font-semibold line-clamp-3 ">
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-3">{excerpt}</p>
        <div className="flex gap-2 py-6 flex-wrap">
          {post.tags.map((tag) => (
            <Link href={`/blog/tag/${tag}`} key={tag}>
              <Badge variant="secondary">#{tag}</Badge>
            </Link>
          ))}
        </div>
        <div className="flex  justify-between w-full gap-2">
          <div className="flex gap-1">
            <div className="relative h-8 w-8 rounded-full shadow-lg overflow-hidden bg-slate-200">
              {post.user.image ? (
                <Image
                  src={post.user.image}
                  alt={post.user.name}
                  fill
                  unoptimized
                  className="rounded-full shadow-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-muted-foreground">
                  {post.user.name?.charAt(0) ?? "?"}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold">
                {post.user.name}
              </span>
              <span className="text-[10px] text-neutral-500 font-semibold">
                {format(post.createdAt, "dd/MM/yyyy")}
              </span>
            </div>
          </div>

          <Link
            href={`/blog/posts/${post.slug}`}
            className="flex gap-1 text-xs items-center font-medium"
          >
            阅读更多
            <MoveRight />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
