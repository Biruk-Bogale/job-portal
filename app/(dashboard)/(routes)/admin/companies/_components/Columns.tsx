"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ImageIcon, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CompanyColumns = {
  id: string;
  name: string;
  logo: string;
  createdAt: string;
};

export const columns: ColumnDef<CompanyColumns>[] = [
  {
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => {
      const { logo } = row.original;

      return (
        <>
          {logo ? (
            <div className="w-20 h-20 flex items-center relative rounded-md overflow-hidden">
              <Image
                alt="Logo"
                src={logo || ""}
                className="w-full h-full object-contain"
                fill
              />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center w-20 h-20 bg-neutral-200 rounded-md">
                <ImageIcon className="w-full text-neutral-500" />
              </div>
            </>
          )}
        </>
      );
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <Link href={`/admin/companies/${id}`}>
              <DropdownMenuItem>
                <Pencil className="w-4 h-4" />
                Edit
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
