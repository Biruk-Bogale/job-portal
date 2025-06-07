import { storage } from "@/config/firebase.config";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { resumeId: string } }
) => {
  try {
    const { userId } = await auth();
    const { resumeId } = params;

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }

    const resume = await db.resumes.findUnique({
      where: {
        id: resumeId,
      },
    });

    if (!resume || resume.id !== params.resumeId) {
      return new NextResponse("Attachment not found", { status: 404 });
    }

    // delete from the firebase storage
    const storageRef = ref(storage, resume.url);

    await deleteObject(storageRef);

    // delete from mongodb
    await db.resumes.delete({
      where: {
        id: resumeId,
      },
    });

    return NextResponse.json({ mesaage: "Resume deleted successfully" });
  } catch (error) {
    console.log(`[RESUME_DELETE]:${error}`);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
