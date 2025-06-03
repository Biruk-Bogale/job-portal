"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface JobPublishActionProps {
  disabled: boolean;
  jobId: string;
  isPublished: boolean;
}

const JobPublishAction = ({
  disabled,
  isPublished,
  jobId,
}: JobPublishActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onCLick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        // unpublishe the job
        await axios.patch(`/api/jobs/${jobId}/unpublish`);

        toast.success("Job Un-Published");
      } else {
        // publishe the job
        await axios.patch(`/api/jobs/${jobId}/publish`);

        toast.success("Job Published");
      }

      router.refresh();
    } catch (error) {
      toast.error("Something went error");

      console.log((error as Error)?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/jobs/${jobId}`);

      toast.success("Job Deleted");

      router.refresh();

      return router.push("/admin/jobs");
    } catch (error) {
      toast.error("Something went error");

      console.log((error as Error)?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-3">
      <Button
        variant={"outline"}
        disabled={disabled || isLoading}
        size={"sm"}
        onClick={onCLick}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      <Button
        variant={"destructive"}
        size={"icon"}
        disabled={isLoading}
        onClick={onDelete}
      >
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default JobPublishAction;
