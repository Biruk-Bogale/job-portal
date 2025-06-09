"use client";

import { Job } from "@prisma/client";
import PageContent from "../../../search/_components/PageContent";

interface JobsTabContentProps {
  jobs: Job[];
  userId: string | null;
}

const JobsTabContent = ({ jobs, userId }: JobsTabContentProps) => {
  return <PageContent userId={userId} jobs={jobs} />;
};

export default JobsTabContent;
