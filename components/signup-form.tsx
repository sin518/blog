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

const signUpFormSchema = z
  .object({
    email: z.email({
      message: "请输入有效的邮箱地址",
    }),
    password: z.string().min(8, {
      message: "密码至少需要8个字符",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });
//从 Zod 模式自动推断 TypeScript 类型，确保类型安全。
type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export default function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (values: SignUpFormValues) => {
    try {
      setIsLoading(true);
      await authClient.signUp.email(
        {
          name: values.email,
          email: values.email,
          password: values.password,
          callbackURL: "/",
        },
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

  const signUpWithGithub = async () => {
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch (err) {
      console.error(err);
    }
  };
  const signUpWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>注册你的账号</CardTitle>
        <CardDescription>输入你的账号信息以注册</CardDescription>
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>确认密码</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="确认你的密码"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="cursor-pointer">
              {isLoading ? <Spinner className="size-6" /> : "注册"}
            </Button>
            <p>
              已有账号？{""}
              <Link href="/sign-in" className="text-blue-900">
                登录
              </Link>
            </p>
            <Separator />
            <Button
              type="button"
              className="text-[13px] cursor-pointer "
              onClick={signUpWithGithub}
            >
              使用 Github 注册
            </Button>
            <Button
              type="button"
              className="text-[13px] cursor-pointer "
              onClick={signUpWithGoogle}
            >
              使用 Google 注册
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
