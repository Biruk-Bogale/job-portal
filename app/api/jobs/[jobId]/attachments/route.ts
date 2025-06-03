import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Attachment } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  try {
    const { userId } = await auth();
    const { jobId } = params;

    
    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("ID is missing", { status: 401 });
    }

    // const { url, name } = await req.json();

    const { attachments } = await req.json();

    if (
      !attachments ||
      !Array.isArray(attachments) ||
      attachments.length === 0
    ) {
      return new NextResponse("Invalid Attachment Format", { status: 400 });
    }

    const createAttachements: Attachment[] = [];

    for (const attachment of attachments) {
      const { url, name } = attachment;

      //   check the attachment with the same url is already exists for this jobId

      const existingAttachment = await db.attachment.findFirst({
        where: {
          jobId,
          url,
        },
      });

      if (existingAttachment) {
        // skip the insertion
        console.log(
          `Attachment with URL ${url} already exists for jobId ${jobId}.`
        );
        continue;
      }

      // create  new attachment
      const createdAttachement = await db.attachment.create({
        data: {
          url,
          name,
          jobId,
        },
      });

      createAttachements.push(createdAttachement);
    }

    return NextResponse.json(createAttachements);
  } catch (error) {
    console.log(`[JOB_ATTACHMENT_POST]:${error}`);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
