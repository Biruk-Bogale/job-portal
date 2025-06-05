import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Job } from "@prisma/client";

type GetJobs = {
  title?: string;
  categoryId?: string;
  createdAtFilter?: string;
  shiftTiming?: string;
  workMode?: string;
  yearOfExperience?: string;
  saveJobs?: boolean;
};

export const getJobs = async ({
  categoryId,
  createdAtFilter,
  saveJobs,
  shiftTiming,
  title,
  workMode,
  yearOfExperience,
}: GetJobs): Promise<Job[]> => {
  const { userId } = await auth();

  try {
    // intialize the query object with common options
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {
      where: {
        isPublished: true,
      },
      include: {
        company: true,
        catagory: true,
        attachments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    };

    // execute the query to fetch the jobs based onthe constructed parameter
    const jobs = await db.job.findMany(query);

    return jobs;
  } catch (error) {
    console.log("[GET_JOBS]:", error);

    return [];
  }
};
