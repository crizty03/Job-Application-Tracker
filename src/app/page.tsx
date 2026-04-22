import { getApplications } from "@/actions/application";
import { StatCard } from "@/components/dashboard/stat-card";
import { ApplicationsBarChart, StatusPieChart } from "@/components/dashboard/charts";
import { Briefcase, Send, CheckCircle, XCircle } from "lucide-react";
import { format, subDays } from "date-fns";

export default async function DashboardPage() {
  const result = await getApplications();
  const applications = result.success ? result.data || [] : [];

  // Calculate stats
  const total = applications.length;
  const interviews = applications.filter(a => a.status === "Interview").length;
  const rejected = applications.filter(a => a.status === "Rejected").length;
  const offers = applications.filter(a => a.status === "Offer").length;
  
  const responseRate = total > 0 ? Math.round(((interviews + offers + rejected) / total) * 100) : 0;

  // Process data for bar chart (last 7 days)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    return {
      name: format(d, "MMM dd"),
      date: format(d, "yyyy-MM-dd"),
      total: 0
    };
  });

  applications.forEach(app => {
    const dStr = format(new Date(app.dateApplied), "yyyy-MM-dd");
    const dayData = last7Days.find(d => d.date === dStr);
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-[color:var(--muted-foreground)]">Overview of your job search progress.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Applications"
          value={total}
          icon={Send}
        />
        <StatCard
          title="Interviews Scheduled"
          value={interviews}
          icon={Briefcase}
        />
        <StatCard
          title="Offers Received"
          value={offers}
          icon={CheckCircle}
        />
        <StatCard
          title="Response Rate"
          value={`${responseRate}%`}
          icon={XCircle}
          description="Applications with any response"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <ApplicationsBarChart data={last7Days} />
        {pieData.length > 0 ? (
          <StatusPieChart data={pieData} />
        ) : (
          <div className="col-span-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] flex items-center justify-center text-[color:var(--muted-foreground)] h-[380px]">
            No status data available
          </div>
        )}
      </div>
    </div>
  );
}
