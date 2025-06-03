"use client";

import AttachmentUploads from "@/components/AttachmentUploads";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job, Attachment } from "@prisma/client";
import axios from "axios";
import { File, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface AttachmentsFormProps {
  initialData: Job & { attachments: Attachment[] };
  jobId: string;
}

const formSchema = z.object({
  attachments: z
    .object({
      url: z.string(),
      name: z.string(),
    })
    .array(),
});

const AttachmentsForm = ({ initialData, jobId }: AttachmentsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // Assuming initialData is available and has type of any
  const initialAttachments = Array.isArray(initialData?.attachments)
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialData.attachments.map((attachment: any) => {
        if (
          typeof attachment === "object" &&
          attachment !== null &&
          "url" in attachment &&
          "name" in attachment
        ) {
          return { url: attachment.url, name: attachment.name };
        }
        return { url: "", name: "" }; // Provide default values if the shape is incorrect
      })
    : [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { attachments: initialAttachments },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/jobs/${jobId}/attachments`, value);
      toast.success("Job Updated");
      toggleEditing();

      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");

      console.log((error as Error)?.message);
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Attachments
        <Button
          onClick={toggleEditing}
          variant={"ghost"}
          className="cursor-pointer"
        >
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* display the attachments if not editing */}
      {!isEditing && (
        <>
          {initialData.attachments.map((item) => (
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
                onClick={() => {}}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </>
      )}

      {/* display the attachments if editing */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AttachmentUploads
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(attachements) => {
                        field.onChange(attachements.map((item) => item));
                      }}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                className="cursor-pointer"
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default AttachmentsForm;
