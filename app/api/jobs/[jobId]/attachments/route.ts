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
