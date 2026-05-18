"use client";
import { Category, Post } from "@prisma/client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import { ArrowUpRight, CalendarDays, Eye } from "lucide-react";
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
    <Card className="group w-full gap-0 overflow-hidden rounded-lg border bg-card p-0 shadow-none transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/blog/posts/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              unoptimized
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              无封面图片
            </div>
          )}
        </div>
      </Link>
      <CardHeader className="gap-3 p-5 pb-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {post.category ? (
            <Link href={`/blog/category/${post.category.id}`}>
              <Badge variant="outline">{post.category.name}</Badge>
            </Link>
          ) : null}
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="size-3.5" />
            {format(post.createdAt, "yyyy/MM/dd")}
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3.5" />
            {post.views}
          </span>
        </div>
        <CardTitle className="line-clamp-2 text-xl font-semibold leading-snug">
          <Link href={`/blog/posts/${post.slug}`}>{post.title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5 p-5 pt-0">
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {excerpt}
        </p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link href={`/blog/tag/${tag}`} key={tag}>
              <Badge variant="secondary">#{tag}</Badge>
            </Link>
          ))}
        </div>
        <div className="mt-auto flex w-full items-center justify-between gap-3 border-t pt-4">
          <div className="flex min-w-0 items-center gap-2">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted">
              {post.user.image ? (
                <Image
                  src={post.user.image}
                  alt={post.user.name}
                  fill
                  unoptimized
                  className="rounded-full object-cover"
                  sizes="32px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-muted-foreground">
                  {post.user.name?.charAt(0) ?? "?"}
                </div>
              )}
            </div>

            <span className="truncate text-xs font-medium">{post.user.name}</span>
          </div>

          <Link
            href={`/blog/posts/${post.slug}`}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-medium"
          >
            阅读
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
