"use client";

import { Copy, Edit, Trash } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function CellAction({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

  const onCopy = () => {
    navigator.clipboard.writeText(id);
    toast.success(`帖子已复制到剪贴板`);
  };
  const onRemovePost = async () => {
    try {
      setIsLoading(true);
      // await removeCategory(id);
      toast.success(`帖子已成功删除`);
    } catch (err) {
      throw new Error(`删除帖子时出错 ${err}`);
    } finally {
      router.refresh();

      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-6">
        <div className="cursor-pointer" title="复制帖子ID" onClick={onCopy}>
          <Copy />
        </div>

        <div
          className="cursor-pointer"
          title="编辑帖子"
          onClick={() => {
            router.push(`/posts/${id}`);
          }}
        >
          <Edit />
        </div>

        <div
          className="cursor-pointer"
          title="删除帖子"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          <Trash className="text-red-500" />
        </div>
      </div>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent
          className="sm:max-w-106.25 flex flex-col gap-6"
          aria-describedby="category"
          aria-description="delete category"
        >
          <DialogHeader className="gap-6">
            <DialogTitle>删除帖子</DialogTitle>
            <DialogDescription className="flex flex-col">
              <span className="text-md">确定要删除吗？{""}</span>
              <span className="text-sm text-red-500">此操作不可撤销。</span>
            </DialogDescription>
          </DialogHeader>

          <Button
            variant="destructive"
            onClick={onRemovePost}
            disabled={isLoading}
            className="max-w-40 self-end cursor-pointer"
          >
            {isLoading ? <Spinner className="size-6" /> : "删除帖子"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
