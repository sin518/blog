import React from "react";

import PostCard from "@/components/post-card";
import Header from "@/components/header";
import { NavMenu } from "@/components/navbar";
import Pagination from "@/components/pagination";
import { getPosts } from "./actions/blog";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { posts, totalPages, currentPage } = await getPosts(page);
  return (
    <>
      <div className="relative w-full">
        <NavMenu />
      </div>
      <Header />
      <div className="flex flex-col gap-6 justify-center">
        <div className="container m-auto p-4 grid grid-cols-1 gap-6 py-6">
          {posts.map((post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </div>
        {posts.length > 0 && (
          <Pagination
            page={page}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </>
  );
}
