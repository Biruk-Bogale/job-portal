"use client";

import SearchContainer from "@/components/SearchContainer";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBarRoutes = () => {
  const pathname = usePathname();

  const isAdminPage = pathname?.startsWith("/admin");
  const isPlayerPage = pathname?.startsWith("/jobs");
  const isSearchPage = pathname?.startsWith("/search");

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:flex w-full px-2 pr-8 items-center gapx-6">
          <SearchContainer />
        </div>
      )}

      <div className="flex gap-x-2 ml-auto">
        {isAdminPage || isPlayerPage ? (
          <Link href="/">
            <Button
              variant={"outline"}
              size={"sm"}
              className="border-orange-700/20 cursor-pointer"
            >
              <LogOut />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href="/admin/jobs">
            <Button
              variant={"outline"}
              size={"sm"}
              className="border-orange-700/20 cursor-pointer"
            >
              Admin Mode
            </Button>
          </Link>
        )}
        <UserButton afterSwitchSessionUrl="/" />
      </div>
    </>
  );
};

export default NavBarRoutes;
