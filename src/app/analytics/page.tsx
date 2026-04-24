import { getApplications } from "@/actions/application";
import { ApplicationsBarChart, StatusPieChart } from "@/components/dashboard/charts";
import { format, subDays } from "date-fns";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AnalyticsPage() {
  const result = await getApplications();
  const applications = result.success ? result.data || [] : [];

  // Process data for bar chart (last 14 days for more detailed analytics)
  const last14Days = Array.from({ length: 14 }).map((_, i) => {
    const d = subDays(new Date(), 13 - i);
    return {
      name: format(d, "MMM dd"),
      date: format(d, "yyyy-MM-dd"),
      total: 0
    };
  });

  applications.forEach(app => {
    const dStr = format(new Date(app.dateApplied), "yyyy-MM-dd");
    const dayData = last14Days.find(d => d.date === dStr);
    if (dayData) {
      dayData.total += 1;
    }
  });

  // Process data for pie chart
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(statusCounts).map(key => ({
    name: key,
    value: statusCounts[key]
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-[color:var(--muted-foreground)]">Deep dive into your job search metrics.</p>
      </div>

      <div className="grid gap-6">
        <ApplicationsBarChart data={last14Days} />
        
        <div className="grid gap-6 md:grid-cols-2">
          {pieData.length > 0 ? (
            <StatusPieChart data={pieData} />
          ) : (
            <div className="col-span-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] flex items-center justify-center text-[color:var(--muted-foreground)] h-[380px]">
              No status data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
