import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import JobDetailsPageContent from "./_components/JobDetailsPageContent";
import { Separator } from "@/components/ui/separator";
import { getJobs } from "@/actions/get-job";
import Box from "@/components/Box";
import PageContent from "../_components/PageContent";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
  const { userId } = await auth();

  const job = await db.job.findUnique({
    where: {
      id: params.jobId,
    },
    include: {
      company: true,
      attachments: true,
    },
  });

  if (!job) {
    redirect("/search");
  }

  const profile = await db.userProfile.findUnique({
    where: {
      userId: userId as string,
    },
    include: {
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!profile || !job) {
    redirect("/search");
  }

  const jobs = await getJobs({});

  const filterredJobs = jobs.filter(
    (j) => j.id && j.categoryId === job.categoryId
  );

  return (
    <div className="flex flex-col p-4 md:p-8">
      <JobDetailsPageContent job={job} jobId={job.id} userProfile={profile} />

      {filterredJobs && filterredJobs.length > 0 && (
        <>
          <Separator />

          <Box className="flex-col my-4 items-start justify-start px-4">
            <h2 className="text-lg font-semibold">Related Jobs :</h2>
          </Box>

          <PageContent jobs={filterredJobs} userId={userId} />
        </>
      )}
    </div>
  );
};

export default JobDetailsPage;
