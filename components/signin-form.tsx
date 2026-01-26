"use client";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";
import { Spinner } from "./ui/spinner";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { auth } from "@/lib/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

const signInFormSchema = z.object({
  email: z.email({
    message: "请输入有效的邮箱地址",
  }),
  password: z.string().min(3, {
    message: "密码至少需要3个字符",
  }),
});
//从 Zod 模式自动推断 TypeScript 类型，确保类型安全。
type SignInFormValues = z.infer<typeof signInFormSchema>;

export default function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: SignInFormValues) => {
    try {
      setIsLoading(true);
      await authClient.signIn.email(
        { email: values.email, password: values.password, callbackURL: "/" },
        {
          onSuccess: () => {
            router.push("/");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      );
    } catch (err) {
      console.log({ err });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGithub = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
    });
  };
  const signInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>登录你的账号</CardTitle>
        <CardDescription>输入你的账号信息以登录</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input placeholder="输入你的邮箱地址" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="输入你的密码"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="cursor-pointer">
              {isLoading ? <Spinner className="size-6" /> : "登录"}
            </Button>
            <p>
              没有账号？{""}
              <Link href="/sign-up" className="text-blue-900">
                注册
              </Link>
            </p>
            <Separator />
            <Button
              type="button"
              className="text-[13px] cursor-pointer "
              onClick={signInWithGithub}
            >
              使用 Github 登录
            </Button>
            <Button
              type="button"
              className="text-[13px] cursor-pointer "
              onClick={signInWithGoogle}
            >
              使用 Google 登录
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
