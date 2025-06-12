"use client";

import Box from "@/components/Box";
import { Job } from "@prisma/client";
import PageContent from "../(routes)/search/_components/PageContent";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RecommendedJobsListProps {
  jobs: Job[];
  userId: string | null;
}

const RecommendedJobsList = ({ jobs, userId }: RecommendedJobsListProps) => {
  return (
    <Box className="flex-col justify-center gap-y-4 my-6 mt-12">
      <h2 className="text-2xl font-semibold tracking-wider font-sans">
        Recommended Jobs
      </h2>

      <div className="mt-4 flex">
        <PageContent jobs={jobs} userId={userId} />
      </div>

      <Link href={"/search"} className="my-8">
        <Button className="w-44 h-12 rounded-xl border border-orange-500 hover:bg-transparent hover:shadow-md text-orange-500 hover:text-orange-600 bg-transparent cursor-pointer">
          View All Jobs
        </Button>
      </Link>
    </Box>
  );
};

export default RecommendedJobsList;
