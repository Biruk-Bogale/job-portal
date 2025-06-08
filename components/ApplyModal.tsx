"use client";

import { Resumes, UserProfile } from "@prisma/client";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Box from "./Box";
import Link from "next/link";
import { Button } from "./ui/button";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  userProfile: (UserProfile & { resumes: Resumes[] }) | null;
}

const ApplyModal = ({
  isOpen,
  loading,
  onClose,
  onConfirm,
  userProfile,
}: ApplyModalProps) => {
  const [isMounted, setIsMounted] = useState();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Are you sure?"
      description="This Action can't be undone"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Box>
        <div className="grid grid-cols-2 gap-2 w-full">
          <label className="p-3 border rounded-md">
            {userProfile?.fullName}
          </label>

          <label className="p-3 border rounded-md">
            {userProfile?.contact}
          </label>

          <label className="p-3 border rounded-md col-span-2">
            {userProfile?.email}
          </label>

          <label className="p-3 border rounded-md col-span-2 flex items-center gap-2 whitespace-nowrap">
            Your Active Resume :{" "}
            <span className="text-orange-700 w-full truncate">
              {
                userProfile?.resumes?.find(
                  (resume) => resume?.id === userProfile?.activeResumeId
                )?.name
              }
            </span>
          </label>

          <div className="col-span-2 flex items-center justify-end text-sm text-muted-foreground">
            Change Your Resume{" "}
            <Link href={"/user"} className="text-orange-700 ml-2">
              over here
            </Link>
          </div>
        </div>
      </Box>

      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant={"outline"} onClick={onClose}>
          Cancel
        </Button>

        <Button
          disabled={loading}
          onClick={onConfirm}
          className="bg-orange-700 hover:bg-orange-800"
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
};

export default ApplyModal;
