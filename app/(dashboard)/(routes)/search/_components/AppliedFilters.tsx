"use client";

import { Button } from "@/components/ui/button";
import { Category } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import React from "react";

interface AppliedFiltersProps {
  categories: Category[];
}

const AppliedFilters = ({ categories }: AppliedFiltersProps) => {
  const searchParams = useSearchParams();

  const currentParams = Object.fromEntries(searchParams.entries());

  const shiftTimingParams = Object.fromEntries(
    Object.entries(currentParams).filter(([key]) => key === "shiftTiming")
  );

  const workingModesParams = Object.fromEntries(
    Object.entries(currentParams).filter(([key]) => key === "workMode")
  );

  const getCategoryName = (categoryId: string | null) => {
    const category = categories.find((cat) => cat.id === categoryId);

    console.log(category);

    return category ? category.name : categoryId;
  };

  if (searchParams.size === 0) return null;

  return (
    <>
      <div className="mt-4 flex items-center gap-4">
        {shiftTimingParams &&
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          Object.entries(shiftTimingParams).map(([_, value]) => (
            <>
              {value.split(",").map((item) => (
                <Button
                  variant={"outline"}
                  type="button"
                  key={item}
                  className="flex items-center gap-x-2 text-neutral-500 px-2 py-1 rounded-md bg-orange-50/80 border-orange-200 capitalize cursor-pointer hover:bg-orange-50"
                >
                  {item}
                </Button>
              ))}
            </>
          ))}

        {workingModesParams &&
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          Object.entries(workingModesParams).map(([key, value]) => (
            <div key={value} className="flex gap-1">
              {value.split(",").map((item) => (
                <Button
                  variant={"outline"}
                  type="button"
                  key={item}
                  className="flex items-center gap-x-2 text-neutral-500 px-2 py-1 rounded-md bg-orange-50/80 border-orange-200 capitalize cursor-pointer hover:bg-orange-50"
                >
                  {item}
                </Button>
              ))}
            </div>
          ))}

        {searchParams.get("categoryId") && (
          <Button
            variant={"outline"}
            type="button"
            className="flex items-center gap-x-2 text-neutral-500 px-2 py-1 rounded-md bg-orange-50/80 border-orange-200 capitalize cursor-pointer hover:bg-orange-50"
          >
            {getCategoryName(searchParams.get("categoryId"))}
          </Button>
        )}
      </div>

      {searchParams.get("title") && (
        <div className="flex items-center justify-center flex-col my-4">
          <h2 className="text-3xl text-muted-foreground">
            You searched for :{" "}
            <span className="font-bold text-neutral-900 capitalize">
              {searchParams.get("title")}
            </span>
          </h2>
        </div>
      )}
    </>
  );
};

export default AppliedFilters;
