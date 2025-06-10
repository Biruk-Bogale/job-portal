"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import Link from "next/link";

interface CustomBreadCrumbProps {
  breadCrumbPage: string;
  breadCrumbItem?: { link: string; label: string }[];
}

const CustomBreadCrumb = ({
  breadCrumbPage,
  breadCrumbItem,
}: CustomBreadCrumbProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href="/" className="flex items-center justify-center">
            <Home className="w-3 h-3 mr-2" /> Home
          </Link>
        </BreadcrumbItem>

        {breadCrumbItem && (
          <>
            {breadCrumbItem.map((item, index) => (
              <span key={index} className="flex flex-row items-center">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link href={item.link}>{item.label}</Link>
                </BreadcrumbItem>
              </span>
            ))}
          </>
        )}

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage>{breadCrumbPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadCrumb;
