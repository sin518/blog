"use client";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Category, Post } from "@prisma/client";

const chartConfig = {} satisfies ChartConfig;

interface ChartProps {
  data: Post[];
}

export default function DashboardChart({ data }: ChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>浏览量</CardTitle>
        <CardDescription>帖子浏览量排行</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data} maxBarSize={60}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="title"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 10)}
            />
            <Bar dataKey="views" fill="#2563eb" radius={4} />
            <ChartTooltip content={<ChartTooltipContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
