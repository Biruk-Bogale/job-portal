import IconBadge from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, Network } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import CompanyNameForm from "./_components/NameForm";
import CompanyDescriptionForm from "./_components/DescriptionForm";
import CompanyLogoForm from "./_components/LogoForm";
import CompanySocialContactsForm from "./_components/SocialContactsForm";
import CompanyCoverImageForm from "./_components/CoverImageForm";
import CompanyOverview from "./_components/CompanyOverview";
import WhyJoinUs from "./_components/WhyJoinUs";

interface PageProps {
  params: {
    companyId: string;
  };
}

const CompanyEditPage = async ({ params }: PageProps) => {
  // verify the mongodb ID
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;

  if (!validObjectIdRegex.test(params.companyId)) {
    return redirect("/admin/companies");
  }

  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const company = await db.company.findUnique({
    where: {
      id: params.companyId,
      userId,
    },
  });

  if (!company) {
    return redirect("/admin/companies");
  }

  const requiredFields = [
    company.name,
    company.description,
    company.logo,
    company.coverImage,
    company.mail,
    company.website,
    company.linkedIn,
    company.address_line_1,
    company.city,
    company.state,
    company.overview,
    company.whyJoinUs,
  ];

  const totalFields = requiredFields.length;

  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `${completedFields}/${totalFields}`;

  return (
    <div className="p-6">
      <Link href={"/admin/companies"}>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>

      {/* title */}
      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Company Setup</h1>
          <span className="text-sm text-neutral-500">
            Complete All Fields {completionText}
          </span>
        </div>
      </div>

      {/* container layout */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mt-16">
        {/* left container */}
        <div>
          {/* title */}
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl text-neutral-700">Customize your company</h2>
          </div>

          {/* name form */}
          <CompanyNameForm initialData={company} companyId={company.id} />

          {/* description form */}
          <CompanyDescriptionForm
            initialData={company}
            companyId={company.id}
          />

          {/* comoany logo */}
          <CompanyLogoForm initialData={company} companyId={company.id} />
        </div>

        {/* right container */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Network} />
              <h2 className="text-xl">Company Social Contacts</h2>
            </div>

            {/* socials form */}
            <CompanySocialContactsForm
              initialData={company}
              companyId={company.id}
            />

            {/* company cover image */}
            <CompanyCoverImageForm
              initialData={company}
              companyId={company.id}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <CompanyOverview initialData={company} companyId={company.id} />
        </div>

        <div className="md:col-span-2">
          <WhyJoinUs initialData={company} companyId={company.id} />
        </div>
      </div>
    </div>
  );
};

export default CompanyEditPage;
