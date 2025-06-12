import {
  getPieGraphCompanyCreatedByUser,
  getPieGraphJobCreatedByUser,
  getTotalCompaniesOnPortal,
  getTotalCompaniesOnPortalByUserId,
  getTotalJobsOnPortal,
  getTotalJobsOnPortalByUserId,
} from "@/actions/get-overview-analytics";
import Box from "@/components/Box";
import OverviewPieChart from "@/components/OverviewPieChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";
import { BriefcaseBusiness } from "lucide-react";
import React from "react";

const DashboardAnalyticsPage = async () => {
  const { userId } = await auth();

  const totalJobsOnPortal = await getTotalJobsOnPortal();
  const totalJobsOnPortalByUser = await getTotalJobsOnPortalByUserId(userId);
  const totalCompaniesOnPortal = await getTotalCompaniesOnPortal();
  const totalCompaniesOnPortalByUser = await getTotalCompaniesOnPortalByUserId(
    userId
  );

  const graphJobTotal = await getPieGraphJobCreatedByUser(userId);
  const graphCompanyTotal = await getPieGraphCompanyCreatedByUser(userId);

  return (
    <Box className="flex-col items-start p-4">
      <div className="flex flex-col items-start">
        <h2 className="font-sans tracking-wider font-bold text-2xl">
          Dashboard
        </h2>

        <p className="text-sm text-muted-foreground">
          Overview of your account
        </p>
      </div>

      <Separator className="my-4" />

      <div className="grid gap-4 grid-col-1 md:grid-cols-4 w-full">
        {/* total job on the portal */}
        <Card>
          <CardHeader className="flex items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <BriefcaseBusiness className="w-4 h-4" />
          </CardHeader>

          <CardContent className="text-2xl font-bold">
            {totalJobsOnPortal}
          </CardContent>
        </Card>

        {/* total jobs on the poratl by the user */}
        <Card>
          <CardHeader className="flex items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium">
              Total Jobs By User
            </CardTitle>
            <BriefcaseBusiness className="w-4 h-4" />
          </CardHeader>

          <CardContent className="text-2xl font-bold">
            {totalJobsOnPortalByUser}
          </CardContent>
        </Card>

        {/* total companies on the portal */}
        <Card>
          <CardHeader className="flex items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium">
              Total Companies
            </CardTitle>
            <BriefcaseBusiness className="w-4 h-4" />
          </CardHeader>

          <CardContent className="text-2xl font-bold">
            {totalCompaniesOnPortal}
          </CardContent>
        </Card>

        {/* total companies on the poratl by user */}
        <Card>
          <CardHeader className="flex items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium">
              Total Companies By User
            </CardTitle>
            <BriefcaseBusiness className="w-4 h-4" />
          </CardHeader>

          <CardContent className="text-2xl font-bold">
            {totalCompaniesOnPortalByUser}
          </CardContent>
        </Card>

        {/* month wise jobs count */}
        <Card className="col-spa-1 md:col-span-2">
          <CardHeader className="flex items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium">
              Month Wise Jobs Count
            </CardTitle>
            <BriefcaseBusiness className="w-4 h-4" />
          </CardHeader>

          <CardContent className="text-2xl font-bold">
            <OverviewPieChart data={graphJobTotal} />
          </CardContent>
        </Card>

        {/* month wise compnaies count */}
        <Card className="col-spa-1 md:col-span-2">
          <CardHeader className="flex items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium">
              Month Wise Companies Count
            </CardTitle>
            <BriefcaseBusiness className="w-4 h-4" />
          </CardHeader>

          <CardContent className="text-2xl font-bold">
            <OverviewPieChart data={graphCompanyTotal} />
          </CardContent>
        </Card>
      </div>
    </Box>
  );
};

export default DashboardAnalyticsPage;
