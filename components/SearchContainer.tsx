"use client";

import { SearchIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import qs from "query-string";

const SearchContainer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategotyId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");
  const createdAtFilter = searchParams.get("createdAtFilter");
  const currentShiftTiming = searchParams.get("shiftTiming");
  const currentWorkMode = searchParams.get("workMode");

  const [value, setValue] = useState(currentTitle || "");

  const debouncedValue = useDebounce(value);

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: debouncedValue,
          categoryId: currentCategotyId,
          createdAtFilter: createdAtFilter,
          shiftTiming: currentShiftTiming,
          workMode: currentWorkMode,
        },
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );

    // router.push(url);
    const currentUrl = window.location.pathname + window.location.search;
    if (url !== currentUrl) {
      router.push(url);
    }
  }, [
    debouncedValue,
    currentCategotyId,
    router,
    pathname,
    createdAtFilter,
    currentShiftTiming,
    currentWorkMode,
  ]);

  return (
    <>
      <div className="flex items-center gap-x-2 relative flex-1">
        <SearchIcon className="w-4 h-4 text-neutral-600 absolute left-3" />

        <Input
          placeholder="Search for a job using title"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full pl-9 rounded-lg bg-orange-50/80 focus-visible:ring-orange-200 text-sm"
        />
        {value.length > 0 && (
          <Button
            variant={"ghost"}
            size={"icon"}
            type="button"
            onClick={() => setValue("")}
            className="cursor-pointer absolute right-3 hover:scale-125 hover:bg-transparent"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </>
  );
};

export default SearchContainer;
