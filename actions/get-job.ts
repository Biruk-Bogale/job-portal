import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Job } from "@prisma/client";

type GetJobs = {
  title?: string;
  categoryId?: string;
  createdAtFilter?: string;
  shiftTiming?: string;
  workMode?: string;
  yearsOfExperience?: string;
  saveJobs?: boolean;
};

export const getJobs = async ({
  categoryId,
  createdAtFilter,
  saveJobs,
  shiftTiming,
  title,
  workMode,
  yearsOfExperience,
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

    //
    if (typeof title !== "undefined" || typeof categoryId !== "undefined") {
      query.where = {
        AND: [
          typeof title !== "undefined" && {
            title: {
              contains: title,
              mode: "insensitive",
            },
          },

          typeof categoryId !== "undefined" && {
            categoryId: {
              equals: categoryId,
            },
          },
        ].filter(Boolean),
      };
    }

    // check whether the createdAtFilter is provided or not
    if (createdAtFilter) {
      const currentDate = new Date();
      let startDate: Date;

      switch (createdAtFilter) {
        case "today":
          startDate = new Date(currentDate);
          break;
        case "yesterday":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - 1);
          break;
        case "thisWeek":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - currentDate.getDay()); // set the start date to the begining of the current week
          break;
        case "lastWeek":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - currentDate.getDay() - 7); // set the start date to the begining of the previous week
          break;
        case "thisMonth":
          startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          ); // set the start date to the begining of the current month
          break;

        default:
          startDate = new Date(0);
      }

      // add this condition in the query
      query.where.createdAt = {
        gte: startDate,
      };
    }

    // filter  the data based on the shift  timing
    const formatedShiftTiming = shiftTiming?.split(",");

    if (formatedShiftTiming && formatedShiftTiming.length > 0) {
      query.where.shiftTiming = {
        in: formatedShiftTiming,
      };
    }

    // filter  the data based on the work mode
    const formatedWorkingMode = workMode?.split(",");

    if (formatedWorkingMode && formatedWorkingMode.length > 0) {
      query.where.workMode = {
        in: formatedWorkingMode,
      };
    }

    // filter  the data based on the years of Experience
    const formatedYearsOfExperience = yearsOfExperience?.split(",");

    if (formatedYearsOfExperience && formatedYearsOfExperience.length > 0) {
      query.where.yearsOfExperience = {
        in: formatedYearsOfExperience,
      };
    }

    // execute the query to fetch the jobs based onthe constructed parameter
    const jobs = await db.job.findMany(query);

    return jobs;
  } catch (error) {
    console.log("[GET_JOBS]:", error);

    return [];
  }
};
