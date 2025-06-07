import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Resumes } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }

    // const { url, name } = await req.json();

    const { resumes } = await req.json();

    if (!resumes || !Array.isArray(resumes) || resumes.length === 0) {
      return new NextResponse("Invalid Resume Format", { status: 400 });
    }

    const createResumes: Resumes[] = [];

    for (const resume of resumes) {
      const { url, name } = resume;

      //   check the resume with the same url is already exists for this resumeId

      const existingresume = await db.resumes.findFirst({
        where: {
          userProfileId: userId,
          url,
        },
      });

      if (existingresume) {
        // skip the insertion
        console.log(
          `Resume with URL ${url} already exists for resumeId ${userId}.`
        );
        continue;
      }

      // create  new attachment
      const createdResume = await db.resumes.create({
        data: {
          url,
          name,
          userProfileId: userId,
        },
      });

      createResumes.push(createdResume);
    }

    return NextResponse.json(createResumes);
  } catch (error) {
    console.log(`[USER_RESUME_POST]:${error}`);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
