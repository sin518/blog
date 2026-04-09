import React from "react";
import CategoriesClient from "./client/categories-client";
import { getCategories } from "@/app/actions/categories";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const data = await getCategories();
  return (
    <div>
      <CategoriesClient categories={data} />
    </div>
  );
}
