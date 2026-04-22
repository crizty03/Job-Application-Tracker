import { getApplication } from "@/actions/application";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Calendar, MapPin, Building, Tag, FileText, Banknote } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ApplicationActions } from "@/components/applications/application-actions";

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getApplication(id);
  
  if (!result.success || !result.data) {
    notFound();
  }

  const app = result.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/applications">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{app.jobTitle}</h1>
            <p className="text-[color:var(--muted-foreground)] flex items-center gap-2 mt-1">
              <Building className="h-4 w-4" />
              {app.companyName}
            </p>
          </div>
        </div>
        
        <ApplicationActions id={app.id} currentStatus={app.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[color:var(--muted-foreground)] flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Date Applied
                  </p>
                  <p>{format(new Date(app.dateApplied), "MMMM d, yyyy")}</p>
                </div>
                
                {app.location && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[color:var(--muted-foreground)] flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Location
                    </p>
                    <p>{app.location}</p>
                  </div>
                )}

                {app.salary && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[color:var(--muted-foreground)] flex items-center gap-2">
                      <Banknote className="h-4 w-4" /> Salary
                    </p>
                    <p>{app.salary}</p>
                  </div>
                )}
                
                {app.platform && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[color:var(--muted-foreground)] flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" /> Platform
                    </p>
                    <p>{app.platform}</p>
                  </div>
                )}
              </div>

              {app.jobLink && (
                <div className="pt-4 border-t border-[color:var(--border)]">
                  <Button variant="outline" asChild>
                    <a href={app.jobLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      View Original Job Post <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {app.notes ? (
                <div className="whitespace-pre-wrap text-sm">{app.notes}</div>
              ) : (
                <p className="text-sm text-[color:var(--muted-foreground)] italic">No notes added.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Badge className="text-sm py-1 px-3">{app.status}</Badge>
              </div>
            </CardContent>
          </Card>

          {app.tags && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {app.tags.split(',').map((tag: string, i: number) => (
                    <Badge key={i} variant="secondary">{tag.trim()}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
