"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Category, Post } from "@/lib/generated/prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import CellAction from "./cell-actions";
import Image from "next/image";

type PostWithCategory = Post & { category: Category | null };

export const columns: ColumnDef<PostWithCategory>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "imageUrl",
    header: "图片",
    cell: ({ row }) => (
      <div className="h-10 w-15 relative">
        <Image
          src={row.original.imageUrl}
          alt={row.original.title}
          fill
          sizes="60px"
          className="rounded-sm"
        />
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          标题
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "status",
    header: " 状态",
    cell: ({ row }) => row.getValue("status"),
  },
  {
    accessorKey: "category",
    header: " 类别",
    cell: ({ row }) => row.original.category?.name ?? "未分类",
  },
  {
    accessorKey: "views",
    header: " 浏览量",
    cell: ({ row }) => row.getValue("views"),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <CellAction id={row.original.id} />;
    },
  },
];
