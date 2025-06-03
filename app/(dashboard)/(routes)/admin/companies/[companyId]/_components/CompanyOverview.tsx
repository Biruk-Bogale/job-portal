"use client";

import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import getGenerativeAIResponse from "@/scripts/aistudio";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company } from "@prisma/client";
import axios from "axios";
import { Copy, Lightbulb, Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CompanyOverviewProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  overview: z.string().min(1),
});

const CompanyOverview = ({ initialData, companyId }: CompanyOverviewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rollName, setRollName] = useState("");
  const [aiValue, setAiValue] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      overview: initialData.overview || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, value);
      toast.success("Company Updated");
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

      const customPrompt = `Generate an overview content about ${rollName}. Include information about its history, purpose, features, user base, and impact on the industry. Focus on providing a comprehensive yet concise summary suitable for readers unfamiliar with the platform.`;

      await getGenerativeAIResponse(customPrompt).then((data) => {
        data = data.replace(/^'|'$/g, "");

        const cleanedText = data.replace(/[\*\#]/g, "");

        // console.log(cleanedText);

        // form.setValue("overview", cleanedText);
        setAiValue(cleanedText);

        setIsPrompting(false);
      });
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  const onCopy = () => {
    navigator.clipboard.writeText(aiValue);

    toast.success("Copied to clipboard");
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Company Overview
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

      {/* display the overview if not editing */}
      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.overview && "text-neutral-500 italic"
          )}
        >
          {!initialData.overview && "No overview"}

          {initialData.overview && <Preview value={initialData.overview} />}
        </div>
      )}

      {/* display the overview if editing */}
      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              type="text"
              placeholder="e.g 'National Bank Of Ethiopia'"
              value={rollName}
              onChange={(e) => setRollName(e.target.value)}
              className="w-full p-2 rounded-md bg-neutral-50"
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
            Note*: Type the company name overhere to generate the Company
            Overview content
          </p>

          {aiValue && (
            <div className="w-full h-96 max-h-96 rounded-md bg-white overflow-y-scroll p-3 relative mt-4 text-muted-foreground">
              {aiValue}

              <Button
                className="absolute top-3 right-3 z-10"
                variant={"outline"}
                size={"icon"}
                onClick={onCopy}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="overview"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor {...field} />
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
        </>
      )}
    </div>
  );
};

export default CompanyOverview;
