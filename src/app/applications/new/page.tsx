"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createApplication } from "@/actions/application";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewApplicationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const result = await createApplication(data);

    if (result.success) {
      router.push("/applications");
    } else {
      alert("Failed to save application");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/applications">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Application</h1>
          <p className="text-[color:var(--muted-foreground)]">Track a new job opportunity.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>Enter the information about the job you applied for.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input id="companyName" name="companyName" required placeholder="e.g. Acme Corp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input id="jobTitle" name="jobTitle" required placeholder="e.g. Frontend Engineer" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <select 
                  id="status" 
                  name="status" 
                  className="flex h-9 w-full rounded-md border border-[color:var(--border)] bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--primary)]"
                  defaultValue="Applied"
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
                <Input id="dateApplied" name="dateApplied" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobLink">Job Link (URL)</Label>
                <Input id="jobLink" name="jobLink" type="url" placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Input id="platform" name="platform" placeholder="e.g. LinkedIn, Indeed" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="e.g. Remote, New York" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary (Optional)</Label>
                <Input id="salary" name="salary" placeholder="e.g. $120k - $150k" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" name="tags" placeholder="e.g. React, Startup, Remote" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea 
                  id="notes" 
                  name="notes" 
                  rows={4}
                  className="flex w-full rounded-md border border-[color:var(--border)] bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-[color:var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--primary)]"
                  placeholder="Any extra details, interview prep, etc."
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t border-[color:var(--border)] pt-6">
              <Button type="button" variant="outline" asChild>
                <Link href="/applications">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Application"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
