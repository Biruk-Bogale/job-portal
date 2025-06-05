import { getJobs } from "@/actions/get-job";
import SearchContainer from "@/components/SearchContainer";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import CatagoriesList from "./_components/CatagoriesList";
import PageContent from "./_components/PageContent";

interface SearchProps {
  searchParams: {
    title: string;
    categoryId: string;
    createdAtFilter: string;
    shiftTiming: string;
    workMode: string;
    yearOfExperience: string;
  };
}

const SearchPage = async ({ searchParams }: SearchProps) => {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const { userId } = await auth();

  const jobs = await getJobs({ ...searchParams });

  return (
    <>
      <div className="px-6 pt-6 block md:hidden md:mb-0">
        <SearchContainer />
      </div>

      <div className="p-6">
        {/* categories */}
        <CatagoriesList categories={categories} />
        {/* applied filters */}

        {/* page content */}
        <PageContent jobs={jobs} userId={userId} />
      </div>
    </>
  );
};

export default SearchPage;
