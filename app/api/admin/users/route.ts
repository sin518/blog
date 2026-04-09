import { NextRequest, NextResponse } from "next/server";
import { authSession } from "@/lib/auth-utils";
import prisma from "@/lib/db";
import { hashPassword } from "better-auth/crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await authSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { accounts: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ users: [user] });
}

type UpdatePayload = {
  type: "name" | "avatar" | "password";
  userId: string;
  value: string;
};

export async function PATCH(req: NextRequest) {
  const session = await authSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await req.json()) as UpdatePayload;
  if (!payload?.userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    if (payload.userId !== session.user.id) {
      return NextResponse.json(
        { error: "只能修改自己的信息" },
        { status: 403 },
      );
    }

    if (payload.type === "name") {
      if (!payload.value.trim()) {
        return NextResponse.json({ error: "用户名不能为空" }, { status: 400 });
      }
      await prisma.user.update({
        where: { id: payload.userId },
        data: { name: payload.value.trim() },
      });
      return NextResponse.json({ ok: true });
    }

    if (payload.type === "avatar") {
      if (!payload.value.trim()) {
        return NextResponse.json({ error: "头像不能为空" }, { status: 400 });
      }
      await prisma.user.update({
        where: { id: payload.userId },
        data: { image: payload.value.trim() },
      });
      return NextResponse.json({ ok: true });
    }

    if (payload.type === "password") {
      if (payload.value.length < 8) {
        return NextResponse.json({ error: "密码至少8位" }, { status: 400 });
      }
      const hashed = await hashPassword(payload.value);
      const account = await prisma.account.findFirst({
        where: { userId: payload.userId, providerId: "email" },
      });
      if (!account) {
        return NextResponse.json(
          { error: "未找到邮箱账号，无法修改密码" },
          { status: 404 },
        );
      }
      await prisma.account.update({
        where: { id: account.id },
        data: { password: hashed },
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "未知更新类型" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
