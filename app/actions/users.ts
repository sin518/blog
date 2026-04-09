"use server";

import { authSession } from "@/lib/auth-utils";
import prisma from "@/lib/db";
import { hashPassword } from "better-auth/crypto";

export const getAllUsers = async () => {
  const session = await authSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      accounts: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return [user];
};

export const updateUserName = async (userId: string, name: string) => {
  if (!name.trim()) {
    throw new Error("用户名不能为空");
  }

  const session = await authSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { name: name.trim() },
  });
};

export const updateUserImage = async (userId: string, image: string) => {
  const session = await authSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  if (!image?.trim()) {
    throw new Error("头像地址不能为空");
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { image: image.trim() },
  });
};

export const updateUserPassword = async (
  userId: string,
  newPassword: string,
) => {
  const session = await authSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (newPassword.length < 8) {
    throw new Error("密码至少需要8个字符");
  }

  const hashed = await hashPassword(newPassword);

  const account = await prisma.account.findFirst({
    where: {
      userId,
      providerId: "email",
    },
  });

  if (!account) {
    throw new Error("没有找到与用户关联的邮箱账号，无法修改密码");
  }

  return await prisma.account.update({
    where: { id: account.id },
    data: { password: hashed },
  });
};
