"use client";
import React from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import ImageUploader from "./image-uploader"; // 假设这是你的组件
import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { generateSlug } from "@/lib/utils";
import RichTextEditor from "./toolbars/editor";
import { createPost, updatePost } from "@/app/actions/posts";

// 动态导入 React Select 以避免 SSR 问题
const CreatableSelect = dynamic(() => import("react-select/creatable"), {
  ssr: false,
});

// --- 1. 更新 Schema ---
const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "标题不能为空"),
  content: z.string().min(3, "内容不能为空"),
  // 允许空字符串，或者必须是 URL
  imageUrl: z
    .string()
    .refine((val) => val === "" || z.string().url().safeParse(val).success, {
      message: "请输入有效的图片 URL",
    }),
  categoryId: z.string().min(1, "请选择分类"),
  tags: z.array(z.object({ label: z.string(), value: z.string() })),
  status: z.string(),
  slug: z.string().min(3, "Slug不能为空"),
});

export type PostFormValues = z.infer<typeof formSchema>;

// 定义 props 接口，避免直接用 Partial<FormValues> 导致类型混乱
interface PostFormProps {
  post?: PostFormValues & { categories?: { id: string; name: string }[] };
  categories?: { id: string; name: string }[];
}

export default function PostForm({ post, categories = [] }: PostFormProps) {
  const router = useRouter();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: post?.id || "",
      title: post?.title || "",
      content: post?.content || "",
      imageUrl: post?.imageUrl || "",
      categoryId: post?.categoryId || "",
      tags: post?.tags || [],
      // 注意：确保默认状态与 Select 的 value 对应（例如 "draft" 而不是 "草稿"）
      status: post?.status || "draft",
      slug: post?.slug || "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: PostFormValues) => {
    try {
      if (data.id) {
        await updatePost(data);
        toast.success("文章更新成功！");
      } else {
        await createPost(data);
        toast.success("文章创建成功！");
      }

      router.refresh();
      router.push("/posts");
    } catch (error) {
      toast.error("提交失败");
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="flex flex-col gap-6 py-6">
          {/* 标题字段 */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>标题</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onBlur={(e) => {
                      field.onBlur();
                      // 自动生成 Slug
                      if (!form.getValues("slug") && e.target.value) {
                        form.setValue("slug", generateSlug(e.target.value), {
                          shouldValidate: true,
                        });
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slug 字段 */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 图片上传 */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>图片URL</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <ImageUploader
                      endpoint="imageUploader"
                      defaultUrl={field.value}
                      onChange={(url) => field.onChange(url)}
                    />
                    {/* 也可以保留一个 Input 用于手动输入，或者隐藏 */}
                    <Input {...field} type="hidden" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 内容字段 */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>内容</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value}
                    onChange={(val) => field.onChange(val ?? "")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 标签字段 */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>标签</FormLabel>
                <FormControl>
                  <CreatableSelect
                    isMulti
                    isClearable
                    // React-Select 的 value 需要完整的 object 数组
                    value={field.value}
                    // React-Select 的 onChange 返回的是数组，直接传给 field.onChange
                    onChange={(newValue) => field.onChange(newValue || [])}
                    onCreateOption={(label: string) => {
                      const newOption = { label, value: label.toLowerCase() };
                      field.onChange([...field.value, newOption]);
                    }}
                    components={{ IndicatorsContainer: () => null }}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 右侧边栏 */}
        <div className="flex flex-col gap-6 py-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>额外设置</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* --- 重点修复：分类选择器 --- */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>分类</FormLabel>
                    <Select
                      onValueChange={field.onChange} // 必须绑定 onValueChange
                      defaultValue={field.value} // 使用 defaultValue 或 value
                      value={field.value} // 建议显式绑定 value
                    >
                      <FormControl>
                        <SelectTrigger>
                          {/* SelectValue 需要放在 Trigger 内部 */}
                          <SelectValue placeholder="选择分类" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- 重点修复：状态选择器 --- */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>状态</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择状态" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* 确保 value 与 defaultValues 中的值匹配（英文） */}
                        <SelectItem value="published">
                          已发布 (Published)
                        </SelectItem>
                        <SelectItem value="draft">草稿 (Draft)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="max-w-40 cursor-pointer"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "提交中..." : "提交文章"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
