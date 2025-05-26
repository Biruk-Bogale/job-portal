"use client";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface SideBarRouteItemProps {
  icon: LucideIcon;
  lable: string;
  href: string;
}

const SideBarRouteItem = ({
  icon: Icon,
  lable,
  href,
}: SideBarRouteItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-x-2 text-neutral-500 text-sm font-[500] pl-6 transtion-all hover:text-neutral-600 hover:bg-neutral-300/20",
        isActive &&
          "text-orange-700 bg-orange-200/20 hover:bg-orange-700/20  hover:text-orange-700"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          className={cn("text-neutral-500", isActive && "text-orange-700")}
          size={22}
        />
        {lable}
      </div>

      {/* highlighter color */}

      <div
        className={cn(
          "ml-auto opacity-0 px-0.5 bg-orange-500 h-full transtion-all",
          isActive && "opacity-100"
        )}
      />
    </button>
  );
};

export default SideBarRouteItem;
