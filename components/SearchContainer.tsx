"use client";

import { SearchIcon, X } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const SearchContainer = () => {
  const [value, setValue] = useState("");

  return (
    <>
      <div className="flex items-center gap-x-2 relative flex-1">
        <SearchIcon className="h-4 h-4 text-neutral-600 absolute left-3" />

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
