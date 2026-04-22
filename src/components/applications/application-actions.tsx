"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateApplicationStatus, deleteApplication } from "@/actions/application";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export function ApplicationActions({ id, currentStatus }: { id: string, currentStatus: string }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setIsUpdating(true);
    await updateApplicationStatus(id, e.target.value);
    setIsUpdating(false);
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this application?")) {
      setIsDeleting(true);
      const res = await deleteApplication(id);
      if (res.success) {
        router.push("/applications");
      } else {
        alert("Failed to delete");
        setIsDeleting(false);
      }
    }
  }

  return (
    <div className="flex items-center gap-4">
      <select 
        className="h-9 rounded-md border border-[color:var(--border)] bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--primary)]"
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={isUpdating}
      >
        <option value="Applied">Applied</option>
        <option value="Shortlisted">Shortlisted</option>
        <option value="Interview">Interview</option>
        <option value="Rejected">Rejected</option>
        <option value="Offer">Offer</option>
      </select>
      
      <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isDeleting}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}
