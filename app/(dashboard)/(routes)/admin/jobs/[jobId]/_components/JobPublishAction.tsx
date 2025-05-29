"use client";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import React, { useState } from "react";

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

  const onCLick = () => {};
  const onDelete = () => {};

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
