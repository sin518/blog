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
import { CategoryProps, useCategories } from "@/hooks/use-categories";
import { removeCategory } from "@/app/actions/categories";
import { Spinner } from "@/components/ui/spinner";

export default function CellAction({ id, name }: CategoryProps) {
  const { setCategory, setOpen } = useCategories();
  const [isLoading, setIsLoading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

  const onCopy = () => {
    navigator.clipboard.writeText(id);
    toast.success(`分类${name}已复制到剪贴板`);
  };
  const onRemoveCategory = async () => {
    try {
      setIsLoading(true);
      await removeCategory(id);
      toast.success(`分类${name}已成功删除`);
    } catch (err) {
      throw new Error(`删除分类${name}时出错 ${err}`);
    } finally {
      router.refresh();
      
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-6">
        <div
          className="cursor-pointer"
          title="复制分类ID"
          onClick={onCopy}
        >
          <Copy />
        </div>

        <div
          className="cursor-pointer"
          title="编辑分类"
          onClick={() => {
            setOpen(true);
            setCategory({ id, name });
          }}
        >
          <Edit />
        </div>

        <div
          className="cursor-pointer"
          title="删除分类"
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
            <DialogTitle>删除分类</DialogTitle>
            <DialogDescription className="flex flex-col">
              <span className="text-md">
                确定要删除{name}吗？{""}
              </span>
              <span className="text-sm text-red-500">此操作不可撤销。</span>
            </DialogDescription>
          </DialogHeader>

          <Button
            variant="destructive"
            onClick={onRemoveCategory}
            disabled={isLoading}
            className="max-w-40 self-end cursor-pointer"
          >
            {isLoading ? <Spinner className="size-6"/> : "删除分类"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
