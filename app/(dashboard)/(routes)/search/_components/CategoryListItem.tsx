"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface CategoryListItemProps {
  label: string;
  value: string;
}

const CategoryListItem = ({ label, value }: CategoryListItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;

    const updateQueryParams = {
      ...currentQueryParams,
      categoryId: isSelected ? null : value,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          ...updateQueryParams,
        },
      },
      {
        skipNull: true,
      }
    );

    router.push(url);
  };

  return (
    <Button
      type="button"
      onClick={onClick}
      variant={"outline"}
      className={cn(
        "whitespace-nowrap text-sm tracking-wider text-muted-foreground border px-2 py-[2px] rounded-md hover:bg-orange-700 hover:text-white transition cursor-pointer hover:shadow-md",
        isSelected && "bg-orange-700 text-white shadow-md"
      )}
    >
      {label}
    </Button>
  );
};

export default CategoryListItem;
