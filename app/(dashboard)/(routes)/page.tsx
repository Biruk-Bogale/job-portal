import { getJobs } from "@/actions/get-job";
import Box from "@/components/Box";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import HomeSearchContainer from "../_components/HomeSearchContainer";
import Image from "next/image";
import HomeScreenCategoriesContainer from "../_components/HomeScreenCategoriesContainer";
import HomeCompaniesList from "../_components/HomeCompaniesList";
import RecommendedJobsList from "../_components/RecommendedJobsList";
import { Footer } from "@/components/Footer";

const DashboardHomePage = async () => {
  const { userId } = await auth();
  const jobs = await getJobs({});

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const companies = await db.company.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col py-4 px-4 space-y-24">
      <Box className="flex-col justify-center w-full space-y-4 mt-12">
        <h2 className="text-2xl md:text-4xl font-sans font-bold tracking-wider text-neutral-600">
          Find your dream job now
        </h2>

        <p className="text-2xl text-muted-foreground">
          {jobs.length}+ jobs for you to explore{" "}
        </p>
      </Box>

      <HomeSearchContainer />

      <Box className="relative overflow-hidden h-64 justify-center rounded-lg mt-6">
        <Image
          src={"/img/home-page-Image.jpg"}
          alt="Home Banner"
          fill
          className="object-cover w-full h-full"
        />
      </Box>

      {/* <Image
        src={"/img/home-page-Image.jpg"}
        alt="Home Banner"
        // fill
        width={1000}
        height={240}
        className="object-cover rounded-lg"
      /> */}

      <HomeScreenCategoriesContainer categories={categories} />

      <HomeCompaniesList companies={companies} />

      <RecommendedJobsList jobs={jobs.splice(0, 6)} userId={userId} />

      <Footer/>
    </div>
  );
};

export default DashboardHomePage;
