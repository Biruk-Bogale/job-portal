import Box from "@/components/Box";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";
import NameForm from "./_components/NameForm";
import { db } from "@/lib/db";
import EmailForm from "./_components/EmailForm";
import ContactForm from "./_components/ContactForm";
import ResumeForm from "./_components/ResumeForm";

const ProfilePage = async () => {
  const { userId } = await auth();

  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await db.userProfile.findUnique({
    where: {
      userId,
    },
    include: {
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return (
    <div className="flex flex-col p-4 md:p-8 items-center justify-center">
      <Box>
        <CustomBreadCrumb breadCrumbPage="My Profile" />
      </Box>

      <Box className="flex-col p-4 rounded-md border mt-8 w-full space-y-6">
        {user && user.hasImage && (
          <div className="aspect-square w-24 h-24 rounded-full shadow-md relative">
            <Image
              fill
              className="w-full h-full object-cover rounded-full"
              alt="User Profile Pic"
              src={user.imageUrl}
            />
          </div>
        )}

        <NameForm initialData={profile} userId={userId} />

        <EmailForm initialData={profile} userId={userId} />

        <ContactForm initialData={profile} userId={userId} />

        <ResumeForm initialData={profile} userId={userId} />
      </Box>
    </div>
  );
};

export default ProfilePage;
