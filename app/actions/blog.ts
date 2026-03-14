"use server";

import { authSession } from "@/lib/auth-utils";
import prisma from "@/lib/db";

const PAGE_SIZE = 10;

export const getPosts = async (page: number) => {
  const skip = (page - 1) * PAGE_SIZE;
  const session = await authSession();
  const currentUser = session?.user.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { savedPosts: true },
      })
    : null;
  try {
    const [posts, totalCount] = await prisma.$transaction([
      prisma.post.findMany({
        skip,
        take: PAGE_SIZE,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { image: true, name: true, id: true, savedPosts: true },
          },
          category: true,
        },
      }),
      prisma.post.count(),
    ]);
    return {
      posts: posts.map((post) => ({
        ...post,
        savePosts: currentUser?.savedPosts ?? [],
      })),
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
      currentPage: page,
    };
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};

export const getBlogPostBySlug = async (slug: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        user: { select: { name: true, image: true, id: true } },
        category: true,
      },
    });
    return post;
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};

export const updatePostViews = async (id: string) => {
  try {
    const post = await prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
    return post;
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};
export const getPostsByCategory = async (categoryId: string, page: number) => {
  const skip = (page - 1) * PAGE_SIZE;
  const session = await authSession();
  const currentUser = session?.user.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { savedPosts: true },
      })
    : null;
  try {
    const [posts, totalCount] = await prisma.$transaction([
      prisma.post.findMany({
        where: { categoryId },
        skip,
        take: PAGE_SIZE,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { image: true, name: true, id: true, savedPosts: true },
          },
          category: true,
        },
      }),
      prisma.post.count({ where: { categoryId } }),
    ]);
    return {
      posts: posts.map((post) => ({
        ...post,
        savePosts: currentUser?.savedPosts ?? [],
      })),
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
      currentPage: page,
    };
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};
export const getPostsByTag = async (tag: string, page: number) => {
  const skip = (page - 1) * PAGE_SIZE;
  const session = await authSession();
  const currentUser = session?.user.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { savedPosts: true },
      })
    : null;
  try {
    const [posts, totalCount] = await prisma.$transaction([
      prisma.post.findMany({
        where: { tags: { has: tag } },
        skip,
        take: PAGE_SIZE,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { image: true, name: true, id: true, savedPosts: true },
          },
          category: true,
        },
      }),
      prisma.post.count({ where: { tags: { has: tag } } }),
    ]);
    return {
      posts: posts.map((post) => ({
        ...post,
        savePosts: currentUser?.savedPosts ?? [],
      })),
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
      currentPage: page,
    };
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};
