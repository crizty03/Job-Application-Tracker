"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ApplicationForm } from "@/components/applications/application-form";

export default function NewApplicationPage() {
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

      <ApplicationForm />
    </div>
  );
}
