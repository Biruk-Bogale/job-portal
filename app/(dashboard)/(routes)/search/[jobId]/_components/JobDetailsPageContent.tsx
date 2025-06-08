"use client";

import ApplyModal from "@/components/ApplyModal";
import { Banner } from "@/components/Banner";
import Box from "@/components/Box";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import Preview from "@/components/Preview";
import { Button } from "@/components/ui/button";
import { Attachment, Company, Job, Resumes, UserProfile } from "@prisma/client";
import axios from "axios";
import { FileIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface JobDetailsPageContentProps {
  job: Job & { company: Company | null; attachments: Attachment[] };
  jobId: string;
  userProfile: (UserProfile & { resumes: Resumes[] }) | null;
}

const JobDetailsPageContent = ({
  job,
  jobId,
  userProfile,
}: JobDetailsPageContentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const isApplied = !userProfile?.appliedJobs?.some(
    (applly) => applly?.jobId === jobId
  );

  const onApplied = async () => {
    setIsLoading(true);

    try {
      await axios.patch(`/api/users/${userProfile?.userId}/appliedJobs`, jobId);

      // send the mail to the user

      await axios.post("/api/thankyou", {
        fullName: userProfile?.fullName,
        email: userProfile?.email,
      });

      toast.success("Job Applied");
    } catch (error) {
      console.log((error as Error)?.message);

      toast.error("Something went wrong");
    } finally {
      setOpen(false);
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <>
      <ApplyModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onApplied}
        loading={isLoading}
        userProfile={userProfile}
      />

      {userProfile &&
        userProfile?.appliedJobs?.some(
          (appliedJob) => appliedJob.jobId === jobId
        ) && (
          <Banner
            variant={"success"}
            label="Thank you for applying! Your application has been received, and we're reviewing it carefully. We'll be in touch soon with an update."
          />
        )}

      <Box className="mt-4">
        <CustomBreadCrumb
          breadCrumbItem={[{ label: "Search", link: "/search" }]}
          breadCrumbPage={job?.title !== undefined ? job?.title : ""}
        />
      </Box>

      {/* job cover image */}

      <Box className="mt-4">
        <div className="w-full flex items-center h-72 relative rounded-md overflow-hidden">
          {job.imageUrl ? (
            <>
              <Image
                alt={job?.title}
                fill
                className="object-cover w-full h-full"
                src={job?.imageUrl}
              />
            </>
          ) : (
            <div className="w-full h-full bg-orange-100 flex items-center justify-center">
              <h2 className="text-3xl font-semibold tracking-wider">
                {job?.title}
              </h2>
            </div>
          )}
        </div>
      </Box>

      {/* title and action button */}
      <Box className="mt-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-neutral-600">
            {job?.title}
          </h2>

          <Link href={`/companies/${job?.companyId}`}>
            <div className="flex items-center gap-2 mt-1">
              {job?.company?.logo && (
                <Image
                  alt={job?.company?.name}
                  width={25}
                  height={25}
                  src={job?.company?.logo}
                />
              )}
              <p className="text-muted-foreground text-sm font-semibold">
                {job?.company?.name}
              </p>
            </div>
          </Link>
        </div>

        {/* action button */}
        <div>
          {userProfile ? (
            <>
              {isApplied ? (
                <Button
                  className="text-sm bg-orange-700 hover:bg-orange-900 hover:shadow-sm"
                  onClick={() => setOpen(true)}
                >
                  Apply
                </Button>
              ) : (
                <Button
                  className="text-sm border-orange-400 hover:text-white text-orange-700 hover:bg-orange-900 hover:shadow-sm"
                  variant={"outline"}
                >
                  Already Applied
                </Button>
              )}
            </>
          ) : (
            <Link href={"/user"}>
              <Button className="text-sm px-8 bg-orange-700 hover:bg-orange-900 hover:shadow-sm">
                Update Profile
              </Button>
            </Link>
          )}
        </div>
      </Box>

      {/* decsription */}

      <Box className="flex-col my-4 items-start justify-start px-4">
        <h2 className="text-lg font-semibold">Description :</h2>
        <p className="font-sans">{job?.short_description}</p>
      </Box>
      {job?.description && (
        <Box>
          <Preview value={job?.description} />

          {/* <div
            className="wysiwyg mt-2"
            dangerouslySetInnerHTML={{ __html: job?.description }}
          /> */}
        </Box>
      )}

      {job?.attachments && job?.attachments?.length > 0 && (
        <Box className="flex-col my-4 items-start justify-start px-4 font-sans">
          <h2 className="text-lg font-semibold">Attachments</h2>

          <p>Download the attachments to know more about the job</p>
          {job?.attachments?.map((item) => (
            <div key={item.id} className="space-y-3">
              <Link
                href={item.url}
                target="_blank"
                download
                className="flex items-center gap-1 text-orange-500"
              >
                <FileIcon className="w-4 h-4 mr-2" />
                <p>{item.name}</p>
              </Link>
            </div>
          ))}
        </Box>
      )}
    </>
  );
};

export default JobDetailsPageContent;
