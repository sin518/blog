import React from "react";
import Image from "next/image";
import Link from "next/link";

import PostCard from "@/components/post-card";
import { NavMenu } from "@/components/navbar";
import Pagination from "@/components/pagination";
import { getPosts } from "./actions/blog";
import { authSession } from "@/lib/auth-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Clock3, Layers3, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { stripHtml } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { posts, totalPages, currentPage } = await getPosts(page);
  const session = await authSession();
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);
  const categories = Array.from(
    new Map(
      posts
        .filter((post) => post.category)
        .map((post) => [post.category!.id, post.category!]),
    ).values(),
  ).slice(0, 8);
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags))).slice(
    0,
    12,
  );

  return (
    <div className="min-h-dvh bg-background">
      <div className="sticky top-0 z-30 w-full border-b bg-background/90 backdrop-blur">
        <NavMenu
          userName={session?.user.name}
          userImage={session?.user.image as string}
        />
      </div>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-8 border-b pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:items-end">
          <div className="flex max-w-3xl flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5" />
              独立博客 · 技术观察 · 产品实践
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-normal text-foreground sm:text-5xl lg:text-6xl">
                记录技术、产品和日常实践里的真实问题
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                聚合最新文章、实用经验和长期笔记，用更清晰的结构帮助你快速找到值得读的内容。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="#latest">
                  开始阅读
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">进入后台</Link>
              </Button>
            </div>
            <div className="grid max-w-xl grid-cols-3 gap-3 pt-2">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BookOpen className="size-4" />
                  文章
                </div>
                <strong className="mt-2 block text-2xl">{posts.length}</strong>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Layers3 className="size-4" />
                  分类
                </div>
                <strong className="mt-2 block text-2xl">
                  {categories.length}
                </strong>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="size-4" />
                  标签
                </div>
                <strong className="mt-2 block text-2xl">{tags.length}</strong>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border bg-card">
            {featuredPost ? (
              <Link
                href={`/blog/posts/${featuredPost.slug}`}
                className="group block"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  {featuredPost.imageUrl ? (
                    <Image
                      src={featuredPost.imageUrl}
                      alt={featuredPost.title}
                      fill
                      priority
                      unoptimized
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 520px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      暂无封面
                    </div>
                  )}
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {featuredPost.category ? (
                      <Badge variant="secondary">
                        {featuredPost.category.name}
                      </Badge>
                    ) : null}
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="size-3.5" />
                      {format(featuredPost.createdAt, "yyyy/MM/dd")}
                    </span>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      精选文章
                    </p>
                    <h2 className="line-clamp-2 text-2xl font-semibold">
                      {featuredPost.title}
                    </h2>
                  </div>
                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {stripHtml(featuredPost.content)}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 p-8 text-center">
                <BookOpen className="size-10 text-muted-foreground" />
                <h2 className="text-xl font-semibold">还没有发布文章</h2>
                <p className="max-w-sm text-sm text-muted-foreground">
                  发布第一篇文章后，首页会自动生成精选内容和文章流。
                </p>
                <Button asChild>
                  <Link href="/dashboard">去创建文章</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {(categories.length > 0 || tags.length > 0) && (
          <section className="grid gap-6 rounded-lg border p-5 lg:grid-cols-[220px_1fr]">
            <div>
              <h2 className="text-lg font-semibold">探索内容</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                按分类和标签快速进入主题。
              </p>
            </div>
            <div className="space-y-4">
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Link
                      href={`/blog/category/${category.id}`}
                      key={category.id}
                    >
                      <Badge className="px-3 py-1.5" variant="outline">
                        {category.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link href={`/blog/tag/${tag}`} key={tag}>
                      <Badge className="px-3 py-1.5" variant="secondary">
                        #{tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {posts.length > 0 && (
          <section id="latest" className="space-y-6">
            <div className="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-2xl font-semibold">最新文章</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  按发布时间排序，持续更新。
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                第 {currentPage} 页 / 共 {totalPages} 页
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {(page === 1 && recentPosts.length > 0 ? recentPosts : posts).map(
                (post) => <PostCard post={post} key={post.id} />,
              )}
            </div>
          </section>
        )}

        {posts.length > 0 && (
          <Pagination
            page={page}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        )}
      </main>
    </div>
  );
}
