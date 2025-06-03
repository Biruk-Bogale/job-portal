import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { columns, JobsColumns } from "./_components/Columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { format } from "date-fns";

const JobPageOverView = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/admin/jobs");
  }

  const jobs = await db.job.findMany({
    where: {
      userId,
    },
    include: {
      catagory: true,
      company: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedJobs: JobsColumns[] = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company ? job.company.name : "",
    category: job.catagory ? job.catagory?.name : "N/A",
    isPublished: job.isPublished,
    createdAt: job.createdAt
      ? format(job.createdAt.toLocaleDateString(), "MMMM do, yyy")
      : "N/A",
  }));

  return (
    <div className="p-6 ">
      <div className="flex items-end justify-end">
        <Link href={"/admin/create"}>
          <Button className="cursor-pointer">
            <Plus className="w-5 h-5 mr-2 " /> New Job
          </Button>
        </Link>
      </div>

      {/* datatable - List of jobs */}
      <div className="mt-6">
        <DataTable columns={columns} data={formatedJobs} searchKey="title" />
      </div>
    </div>
  );
};

export default JobPageOverView;
