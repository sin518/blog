"use client";

import Image from "next/image";
import { useState } from "react";
import ImageUploader from "@/components/image-uploader";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

type UserWithAccount = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  accounts: { id: string; providerId: string; accountId: string }[];
};

type UserManagerProps = {
  initialUsers: UserWithAccount[];
};

export default function UserManager({ initialUsers }: UserManagerProps) {
  const [users, setUsers] = useState(initialUsers);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>(
    initialUsers[0]?.id ?? "",
  );

  const updateUser = async (
    userId: string,
    type: "name" | "avatar" | "password",
    value: string,
  ) => {
    setLoadingIds((prev) => [...prev, userId]);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        body: JSON.stringify({ userId, type, value }),
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body?.error || "更新失败");
      }
      if (type === "name") {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, name: value } : user,
          ),
        );
      }
      if (type === "avatar") {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, image: value } : user,
          ),
        );
      }
      toast.success("保存成功");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "更新失败");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 rounded-lg border p-4 bg-slate-50">
        <p className="text-sm text-slate-600">
          你只能管理自己的信息；点击头像进入编辑状态后，可以修改昵称、密码和头像。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-xl border p-4 bg-white shadow-sm"
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedUserId(user.id);
                  toast.success("已选中此用户，可开始编辑");
                }}
                className="h-12 w-12 overflow-hidden rounded-full bg-slate-200 p-0"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                    {user.name?.slice(0, 2) || "用户"}
                  </div>
                )}
              </button>
              <div>
                <div className="font-semibold">{user.name}</div>
                <div className="text-xs text-slate-500">{user.email}</div>
              </div>
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  用户名
                </label>
                <div className="flex gap-2">
                  <Input
                    defaultValue={user.name}
                    onBlur={(event) => {
                      const value = event.currentTarget.value;
                      if (value && value !== user.name) {
                        updateUser(user.id, "name", value);
                      }
                    }}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  修改密码
                </label>
                <div className="flex gap-2">
                  <Input
                    id={`password-${user.id}`}
                    placeholder="至少8位"
                    type="password"
                    className="flex-1"
                  />
                  <Button
                    onClick={() => {
                      const input = document.getElementById(
                        `password-${user.id}`,
                      ) as HTMLInputElement | null;
                      if (!input || input.value.trim().length < 8) {
                        toast.error("密码必须至少8个字符");
                        return;
                      }
                      updateUser(user.id, "password", input.value.trim());
                      input.value = "";
                    }}
                    className="whitespace-nowrap"
                  >
                    修改
                  </Button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  上传头像
                </label>
                <ImageUploader
                  defaultUrl={user.image ?? ""}
                  onChange={(url) => {
                    updateUser(user.id, "avatar", url);
                  }}
                  endpoint="imageUploader"
                />
              </div>

              <div>
                <Button
                  onClick={() => {
                    setSelectedUserId(user.id);
                    toast.success("已选中用户，可直接修改");
                  }}
                  className="w-full"
                >
                  {loadingIds.includes(user.id) ? (
                    <Spinner className="size-4" />
                  ) : selectedUserId === user.id ? (
                    "已选中，继续编辑"
                  ) : (
                    "点击头像进入编辑"
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
