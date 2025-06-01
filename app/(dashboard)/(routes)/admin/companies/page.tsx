import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { columns, CompanyColumns } from "./_components/Columns";
import { format } from "date-fns";
import { DataTable } from "@/components/DataTable";

const CompaniesOverViewPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const companies = await db.company.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedCompanies: CompanyColumns[] = companies.map((company) => ({
    id: company.id,
    name: company.name ? company.name : "",
    logo: company.logo ? company.logo : "",
    createdAt: company.createdAt
      ? format(company.createdAt.toLocaleDateString(), "MMMM do, yyy")
      : "N/A",
  }));

  return (
    <div className="p-6 ">
      <div className="flex items-end justify-end">
        <Link href={"/admin/companies/create"}>
          <Button className="cursor-pointer">
            <Plus className="w-5 h-5 mr-2 " /> New Company
          </Button>
        </Link>
      </div>

      {/* datatable - List of jobs */}
      <div className="mt-6">
        <DataTable
          columns={columns}
          data={formatedCompanies}
          searchKey="title"
        />
      </div>
    </div>
  );
};

export default CompaniesOverViewPage;
