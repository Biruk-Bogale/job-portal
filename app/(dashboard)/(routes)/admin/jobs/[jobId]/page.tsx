import React from "react";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
  return <div>Job Details : {params?.jobId}</div>;
};

export default JobDetailsPage;
