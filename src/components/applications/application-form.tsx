"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createApplication, updateApplication } from "@/actions/application";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type ApplicationInput = {
  companyName: string;
  jobTitle: string;
  jobLink?: string | null;
  platform?: string | null;
  status: string;
  dateApplied?: Date | null;
  location?: string | null;
  salary?: string | null;
  tags?: string | null;
  notes?: string | null;
};

export function ApplicationForm({ 
  initialData, 
  applicationId 
}: { 
  initialData?: ApplicationInput, 
  applicationId?: string 
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!applicationId;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      companyName: formData.get("companyName") as string,
      jobTitle: formData.get("jobTitle") as string,
      jobLink: formData.get("jobLink") as string,
      platform: formData.get("platform") as string,
      status: formData.get("status") as string,
      dateApplied: formData.get("dateApplied") as string,
      location: formData.get("location") as string,
      salary: formData.get("salary") as string,
      tags: formData.get("tags") as string,
      notes: formData.get("notes") as string,
    };

    let result;
    if (isEditing) {
      result = await updateApplication(applicationId, data);
    } else {
      result = await createApplication(data);
    }

    if (result.success) {
      if (isEditing) {
        router.push(`/applications/${applicationId}`);
      } else {
        router.push("/applications");
      }
    } else {
      alert(`Failed to ${isEditing ? 'update' : 'save'} application`);
      setIsSubmitting(false);
    }
  }

  // Format date for the input field (YYYY-MM-DD)
  const defaultDate = initialData?.dateApplied 
    ? new Date(initialData.dateApplied).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Details</CardTitle>
        <CardDescription>
          {isEditing ? "Update the information about this job application." : "Enter the information about the job you applied for."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input id="companyName" name="companyName" required placeholder="e.g. Acme Corp" defaultValue={initialData?.companyName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input id="jobTitle" name="jobTitle" required placeholder="e.g. Frontend Engineer" defaultValue={initialData?.jobTitle} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <select 
                id="status" 
                name="status" 
                className="flex h-9 w-full rounded-md border border-[color:var(--border)] bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--primary)]"
                defaultValue={initialData?.status || "Applied"}
                required
              >
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
                <option value="Offer">Offer</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateApplied">Date Applied</Label>
              <Input id="dateApplied" name="dateApplied" type="date" defaultValue={defaultDate} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobLink">Job Link (URL)</Label>
              <Input id="jobLink" name="jobLink" type="url" placeholder="https://..." defaultValue={initialData?.jobLink || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Input id="platform" name="platform" placeholder="e.g. LinkedIn, Indeed" defaultValue={initialData?.platform || ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="e.g. Remote, New York" defaultValue={initialData?.location || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary (Optional)</Label>
              <Input id="salary" name="salary" placeholder="e.g. $120k - $150k" defaultValue={initialData?.salary || ""} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" name="tags" placeholder="e.g. React, Startup, Remote" defaultValue={initialData?.tags || ""} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea 
                id="notes" 
                name="notes" 
                rows={4}
                className="flex w-full rounded-md border border-[color:var(--border)] bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-[color:var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--primary)]"
                placeholder="Any extra details, interview prep, etc."
                defaultValue={initialData?.notes || ""}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-[color:var(--border)] pt-6">
            <Button type="button" variant="outline" asChild>
              <Link href={isEditing ? `/applications/${applicationId}` : "/applications"}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (isEditing ? "Update Application" : "Save Application")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
