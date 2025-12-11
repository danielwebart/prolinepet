import DashboardCards from "../components/DashboardCards";
import DashboardCharts from "../components/DashboardCharts";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-600">Visão geral das manutenções e recursos.</p>
      </div>
      <DashboardCards />
      <DashboardCharts />
    </div>
  );
}