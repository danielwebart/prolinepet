import { prisma } from "../lib/prisma";
import DashboardCards from "../components/DashboardCards";
import DashboardCharts from "../components/DashboardCharts";
import DashboardTabs from "../components/DashboardTabs";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const uid = session?.user ? Number((session.user as any).id) : null;
  const activeEntityId = (session as any)?.entityId ? Number((session as any).entityId) : ((session as any)?.activeEntityId ? Number((session as any).activeEntityId) : null);

  let modules: any[] = [];

  if (uid && activeEntityId) {
    const rawModules = await prisma.module.findMany({
      where: {
        showDashboardTab: true,
        isActive: true,
        entityModules: {
          some: {
            entityId: activeEntityId
          }
        }
      },
      include: {
        userEntityModules: {
          where: {
            userEntity: {
              userId: uid,
              entityId: activeEntityId
            }
          }
        }
      },
      orderBy: {
        name: 'asc',
      },
    });

    modules = rawModules.filter(m => {
      // Se não houver registro de permissão específica, assume negado (por segurança)
      // Se houver, respeita o flag allowed
      if (m.userEntityModules.length === 0) return false;
      return m.userEntityModules[0].allowed;
    }).map(m => ({
      id: m.id,
      code: m.code,
      name: m.name
    }));
  }

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