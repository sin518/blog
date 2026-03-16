import { getBlogPostBySlug, updatePostViews } from "@/app/actions/blog";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import React from "react";
import RichTextViewer from "@/components/rich-text-viewer";
import { Badge } from "@/components/ui/badge";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  await updatePostViews(post?.id as string);
  if (!post) return null;
  return (
    <div className="w-full flex flex-col items-center p-6 md:p-0 ">
      <div className="flex max-w-6xl flex-col gap-6 justify-center">
        <h1 className="text-2xl md:text-5xl font-semibold">{post.title}</h1>
        <div className="flex gap-6 text-sm">
          <div className="flex gap-6">
            <div className="relative h-8 w-8 rounded-full shadow-lg overflow-hidden bg-slate-200">
              {post.user.image ? (
                <Image
                  src={post.user.image}
                  alt={post.user.name}
                  className="rounded-full shadow-lg"
                  fill
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-muted-foreground">
                  {post.user.name?.charAt(0) ?? "?"}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium">{post.user.name}</span>
              <span className="text-xs text-neutral-500 font-medium">
                {format(post.createdAt, "MM/dd/yyyy")}
              </span>
            </div>
            <Link
              href={`/blog/category/${post.categoryId}`}
              className="font-semibold"
            >
              {post.category?.name}
            </Link>
          </div>
        </div>

        <div className="relative h-80 w-full rounded-sm bg-slate-200 overflow-hidden">
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={post.title}
              className="rounded-sm object-cover"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              无封面图片
            </div>
          )}
        </div>
        <RichTextViewer content={post.content} />
        <div className="flex gap-2 py-6 flex-wrap">
          {post.tags.map((tag) => (
            <Link href={`/blog/tag/${tag}`} key={tag}>
              <Badge variant="secondary">#{tag}</Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
