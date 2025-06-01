"use client";

import { Button } from "@/components/ui/button";
import getGenerativeAIResponse from "@/scripts/aistudio";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import axios from "axios";
import { Lightbulb, Loader2, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface TagsFormProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  tags: z.array(z.string().min(1)),
});

const TagsForm = ({ initialData, jobId }: TagsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const [jobTags, setJobTags] = useState<string[]>(initialData.tags);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, value);
      toast.success("Job Updated");
      toggleEditing();

      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");

      console.log((error as Error)?.message);
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const handlePromtGeneration = async () => {
    try {
      setIsPrompting(true);

      const customPrompt = `Generate an array of top 10 keywords related to the job profession "${prompt}". These keywords should encompass various aspects of the profession, including skills, responsibilities, tools, and technologies commonly associated with it. Aim for a diverse set of keywords that accurately represent the breadth of the profession. Your output should be a list/array of keywords. Just return me only the array alone.`;

      await getGenerativeAIResponse(customPrompt).then((data) => {
        // check the data response is an array or not

        const match = data.match(/\[.*?\]/);

        const keywords = match ? JSON.parse(match[0]) : [];

        if (Array.isArray(keywords)) {
          setJobTags((prevTags) => [...prevTags, ...keywords]);
        }

        setIsPrompting(false);
      });
    } catch (error) {
      console.log((error as Error).message);
      toast.error("something went wrong");
    }
  };

  const handleTagRemove = (index: number) => {
    const updatedTags = [...jobTags];
    updatedTags.splice(index, 1);
    setJobTags(updatedTags);
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Tags
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

      {/* display the tags if not editing */}
      {!isEditing && (
        <div className="flex items-center flex-wrap gap-2">
          {initialData.tags.length > 0 ? (
            initialData.tags.map((tag, index) => (
              <div
                key={index}
                className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-orange-100"
              >
                {tag}
              </div>
            ))
          ) : (
            <p>No tags</p>
          )}
        </div>
      )}

      {/* display the tags if editing */}
      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              type="text"
              placeholder="e.g 'Full-stack developer'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 rounded-md"
            />

            {isPrompting ? (
              <>
                <Button>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handlePromtGeneration}>
                  <Lightbulb className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground text-right">
            Note*: Profession Name alone enough to generate the tags
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {jobTags?.length > 0 ? (
              jobTags?.map((tag, index) => (
                <div
                  key={index}
                  className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-orange-100"
                >
                  {tag}{" "}
                  {isEditing && (
                    <Button
                      variant={"ghost"}
                      className="p-0 h-auto"
                      onClick={() => handleTagRemove(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p>No Tags</p>
            )}
          </div>

          <div className="flex items-center gap-2 justify-end mt-4">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => {
                setJobTags([]);
                onSubmit({ tags: [] });
              }}
            >
              Clear All
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => onSubmit({ tags: jobTags })}
            >
              Save
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TagsForm;
