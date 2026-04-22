"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, ExternalLink, MoreVertical, Building } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

type ApplicationListProps = {
  initialApplications: any[];
};

export function ApplicationList({ initialApplications }: ApplicationListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredApps = initialApplications.filter(app => {
    const matchesSearch = app.companyName.toLowerCase().includes(search.toLowerCase()) || 
                          app.jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch(status) {
      case "Applied": return "secondary";
      case "Shortlisted": return "outline";
      case "Interview": return "warning";
      case "Rejected": return "destructive";
      case "Offer": return "success";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[color:var(--muted-foreground)]" />
          <Input 
            type="search" 
            placeholder="Search company or title..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="h-9 rounded-md border border-[color:var(--border)] bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--primary)]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Offer">Offer</option>
          </select>
        </div>
      </div>

      {filteredApps.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[color:var(--border)]">
          <p className="text-[color:var(--muted-foreground)]">No applications found.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app) => (
            <Card key={app.id} className="flex flex-col transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg line-clamp-1">{app.jobTitle}</CardTitle>
                    <div className="flex items-center text-sm text-[color:var(--muted-foreground)]">
                      <Building className="mr-1 h-3 w-3" />
                      {app.companyName}
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(app.status)}>{app.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <div className="space-y-2 text-sm text-[color:var(--muted-foreground)]">
                  {app.location && (
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      {app.location}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Applied {format(new Date(app.dateApplied), "MMM d, yyyy")}
                  </div>
                </div>
                
                {app.tags && (
                  <div className="mt-4 flex flex-wrap gap-1">
                    {app.tags.split(',').map((tag: string, i: number) => (
                      <Badge key={i} variant="secondary" className="px-1.5 py-0 text-[10px]">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex items-center gap-2 border-t border-[color:var(--border)] pt-4">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/applications/${app.id}`}>View Details</Link>
                </Button>
                {app.jobLink && (
                  <Button variant="ghost" size="icon" className="shrink-0" asChild>
                    <a href={app.jobLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
