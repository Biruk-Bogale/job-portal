import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { ApplicantColumns, columns } from "./_components/Columns";
import { format } from "date-fns";
import Box from "@/components/Box";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { DataTable } from "@/components/DataTable";

const JobApplicantsPage = async ({ params }: { params: { jobId: string } }) => {
  const { userId } = await auth();

  const job = await db.job.findUnique({
    where: {
      id: params.jobId,
      userId: userId as string,
    },
  });

  if (!job) {
    redirect("/admin/jobs");
  }

  const profiles = await db.userProfile.findMany({
    include: {
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  //   const jobs = await db.job.findMany({
  //     where: {
  //       userId: userId as string,
  //     },
  //     include: {
  //       company: true,
  //       catagory: true,
  //     },
  //     orderBy: {
  //       createdAt: "desc",
  //     },
  //   });

  const filteredProfile =
    profiles &&
    profiles.filter((profile) =>
      profile.appliedJobs.some(
        (appliedJob) => appliedJob.jobId === params.jobId
      )
    );

  const formatedProfiles: ApplicantColumns[] = filteredProfile.map(
    (profile) => ({
      id: profile.userId,
      fullName: profile?.fullName ? profile?.fullName : "",
      email: profile?.email ? profile?.email : "",
      contact: profile?.contact ? profile?.contact : "",
      appliedAt: profile?.appliedJobs.find((job) => job.jobId === params.jobId)
        ?.appliedAt
        ? format(
            new Date(
              profile.appliedJobs.find((job) => job.jobId === params.jobId)
                ?.appliedAt ?? ""
            ),
            "MMMM do, yyyy"
          )
        : "",

      resume:
        profile.resumes.find((res) => res.id === profile.activeResumeId)?.url ??
        "",

      resumeName:
        profile?.resumes.find((res) => res.id === profile.activeResumeId)
          ?.name ?? "",
    })
  );

  return (
    <div className="flex-col p-4 md:p-8 items-center justify-center flex">
      <Box>
        <CustomBreadCrumb
          breadCrumbPage="Applicants"
          breadCrumbItem={[
            { link: "/admin/jobs", label: "Jobs" },
            { link: "/admin/jobs", label: `${job ? job.title : ""}` },
          ]}
        />
      </Box>

      <div className="mt-6 w-full">
        <DataTable
          columns={columns}
          data={formatedProfiles}
          searchKey="fullName"
        />
      </div>
    </div>
  );
};

export default JobApplicantsPage;
