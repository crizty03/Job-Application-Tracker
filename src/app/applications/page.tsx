import { getApplications } from "@/actions/application";
import { ApplicationList } from "@/components/applications/application-list";

export default async function ApplicationsPage() {
  const result = await getApplications();
  const applications = result.success ? result.data || [] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-[color:var(--muted-foreground)]">Manage and track all your job applications.</p>
      </div>

      <ApplicationList initialApplications={applications} />
    </div>
  );
}
