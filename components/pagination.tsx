"use client";
import { cn } from "@/lib/utils";
import { MoveLeft, MoveRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function Pagination({
  currentPage,
  totalPages,
  page,
  pageUrl,
}: {
  currentPage: number;
  totalPages: number;
  page: number;
  pageUrl?: string;
}) {
  const router = useRouter();
  return (
    <div className="flex gap-6 flow-row w-full pb-14">
      <div className="w-full flex gap-6 justify-center">
        <Button
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full shadow-lg cursor-pointer opacity-100",
            currentPage === 1 && " opacity-50 pointer-events-none",
          )}
          disabled={currentPage === 1}
          onClick={() => {
            router.push(
              `${
                pageUrl
                  ? `${pageUrl}?page=${currentPage - 1}`
                  : `?page=${currentPage - 1}`
              }`,
            );
          }}
        >
          <MoveLeft />
        </Button>

        <div className="flex items-center justify-center text-sm gap-6">
          Page{page} of {totalPages}
        </div>

        <Button
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full shadow-lg cursor-pointer opacity-100",
            currentPage === totalPages && " opacity-50  pointer-events-none",
          )}
          disabled={currentPage === totalPages}
          onClick={() => {
            router.push(
              `${
                pageUrl
                  ? `${pageUrl}?page=${currentPage + 1}`
                  : `?page=${currentPage + 1}`
              }`,
            );
          }}
        >
          <MoveRight />
        </Button>
      </div>
    </div>
  );
}
