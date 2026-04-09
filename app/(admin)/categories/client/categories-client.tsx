'use client'
import { DataTable } from "@/components/data-table";
import { Category } from "@prisma/client";
import { z } from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategories } from "@/hooks/use-categories";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createCategory, updateCategory } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";



import { columns } from "./columns";
import { useEffect } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  name: z.string().min(3, { message: "Name is required" }),
});
type FormValues = z.infer<typeof formSchema>;

export default function CategoriesClient({
  categories,
}: {
  categories: Category[];
}) {
  const { open, setOpen, category, setCategory } = useCategories();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
    mode: "onBlur",
  });

  // 当编辑状态改变时更新表单值
  useEffect(() => {
    if (category?.id) {
      form.setValue("name", category.name);
    } else {
      form.reset({ name: "" });
    }
  }, [category, form]);

  

  const onSubmit = async (data: FormValues) => {
    try {
      if (category?.id) {
        await updateCategory({ id: category.id, name: data.name });
        toast.success("分类更新成功");
      } else {
        await createCategory(data.name);
        toast.success("分类创建成功");
      }

      router.refresh();
      form.reset();
      setCategory({ id: "", name: "" });
        setOpen(false);
      } catch (err) {
        const error = err as Error;
        toast.error(error.message ?? "操作失败");
      }
    };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="category-form">
            <DialogContent
              className="sm:max-w-[425px]"
              aria-describedby="category"
              aria-description="create category"
            >
              <DialogHeader>
                <DialogTitle>更新分类</DialogTitle>
              </DialogHeader>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>名称</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="cursor-pointer"
                form="category-form"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                {form.formState.isSubmitting ? (
                  <Spinner className="size-6" />
                ) : (
                  "保存更改"
                )}
              </Button>
            </DialogContent>
          </form>
        </Form>
      </Dialog>

      <div className="flex flex-col p-8">
        <div className="flex w-full justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">主页</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>分类</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Button className="cursor-pointer" onClick={() => setOpen(true)}>
            创建分类
          </Button>
        </div>
      </div>

      <div className="p-8 flex flex-col">
        <DataTable data={categories} columns={columns} />
      </div>
    </>
      
  );
}
