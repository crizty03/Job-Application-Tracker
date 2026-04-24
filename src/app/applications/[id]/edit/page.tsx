import { getApplication } from "@/actions/application";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ApplicationForm } from "@/components/applications/application-form";

export default async function EditApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getApplication(id);
  
  if (!result.success || !result.data) {
    notFound();
  }

  const app = result.data;

  // Transform Prisma output (where dates are Date objects) to the string format expected by the form
  const initialData = {
    companyName: app.companyName,
    jobTitle: app.jobTitle,
    jobLink: app.jobLink,
    platform: app.platform,
    status: app.status,
    dateApplied: app.dateApplied,
    location: app.location,
    salary: app.salary,
    tags: app.tags,
    notes: app.notes,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/applications/${id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Application</h1>
          <p className="text-[color:var(--muted-foreground)]">Update the details for {app.companyName}.</p>
        </div>
      </div>

      <ApplicationForm initialData={initialData} applicationId={id} />
    </div>
  );
}
