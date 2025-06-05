"use client";
import { Category } from "@prisma/client";
import React from "react";
import CategoryListItem from "./CategoryListItem";

interface CatagoriesListProps {
  categories: Category[];
}

const CatagoriesList = ({ categories }: CatagoriesListProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-6 scrollbar-none">
      {categories?.map((category) => (
        <CategoryListItem
          key={category.id}
          label={category.name}
          value={category.id}
        />
      ))}
    </div>
  );
};

export default CatagoriesList;
