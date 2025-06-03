"use client";

import { storage } from "@/config/firebase.config";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { File, FilePlus, ImagePlus, Trash, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

interface AttachmentUploadsProps {
  disabled?: boolean;
  onChange: (value: { url: string; name: string }[]) => void;
  onRemove: (value: string) => void;
  value: { url: string; name: string }[];
}

const AttachmentUploads = ({
  onChange,
  onRemove,
  value,
}: AttachmentUploadsProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);

    setIsLoading(true);

    // array to store newly uploaded urls
    const newUrls: { url: string; name: string }[] = [];

    // counter to keep track the uploaded files
    let completedFiles = 0;

    files.forEach((file: File) => {
      const uploadTask = uploadBytesResumable(
        ref(storage, `Attachments/${Date.now()}-${file.name}`),
        file,
        { contentType: file.type }
      );

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },

        (error) => {
          toast.error(error.message);
        },

        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            // store this url
            newUrls.push({
              url: downloadUrl,
              name: file.name,
            });

            // increase the count of the counter
            completedFiles++;

            // check the files are uploaded or not
            if (completedFiles === files.length) {
              setIsLoading(false);

              onChange([...value, ...newUrls]);
            }
          });
        }
      );
    });
  };

  const onDelete = ({ url, name }: { url: string; name: string }) => {
    const newValue = value.filter((data) => data.name !== name);

    onChange(newValue);

    deleteObject(ref(storage, url)).then(() => {
      toast.success("Attachment Removed");
    });
  };

  return (
    <div>
      <div className="w-full p-2 flex items-center justify-end">
        {isLoading ? (
          <>{`${progress.toFixed(2)}%`}</>
        ) : (
          <label>
            <div className="flex gap-2 items-center cursor-pointer justify-center">
              <FilePlus className="w-3 h-3 mr-2" />
              <p>Add a file</p>
            </div>

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt"
              multiple
              className="w-0 h-0"
              onChange={onUpload}
            />
          </label>
        )}
      </div>

      <div className="flex-col">
        {value && value.length > 0 ? (
          <>
            {/* dispaly attachment */}
            <div className="space-y-2">
              {value.map((item) => (
                <div
                  key={item.url}
                  className="flex items-center p-3 w-full bg-orange-100 border-orange-200 border text-orange-700 rounded-md "
                >
                  <File className="w-4 h-4 mr-2" />
                  <p className="text-xs w-full truncate">{item.name}</p>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    type="button"
                    className="p-1"
                    onClick={() => onDelete(item)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>No Attachments</p>
        )}
      </div>
    </div>
  );
};

export default AttachmentUploads;
