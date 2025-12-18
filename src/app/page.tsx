import { prisma } from "../lib/prisma";
import DashboardCards from "../components/DashboardCards";
import DashboardCharts from "../components/DashboardCharts";
import DashboardTabs from "../components/DashboardTabs";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const modules = await prisma.module.findMany({
    where: {
      showDashboardTab: true,
      isActive: true,
    },
    select: {
      id: true,
      code: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
      <DashboardTabs 
        modules={modules} 
        maintenanceContent={
          <div className="space-y-6">
            <DashboardCards />
            <DashboardCharts />
          </div>
        } 
      />
    </div>
  );
}