import { requireAuth } from "@/lib/auth-utils";
import { getAllUsers } from "@/app/actions/users";
import UserManager from "@/components/user-manager";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  await requireAuth();
  const users = await getAllUsers();

  return (
    <div className="min-h-screen">
      <div className="flex flex-col p-8">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold">用户管理</h1>
            <p className="text-sm text-slate-500">
              点击头像或编辑即可修改用户信息、密码和头像。
            </p>
          </div>

          <div className="rounded-full border p-1">
            <a
              href="/users"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-700"
            >
              头像
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <UserManager initialUsers={users} />
      </div>
    </div>
  );
}
