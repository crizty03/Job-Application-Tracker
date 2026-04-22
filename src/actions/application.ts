"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export type ApplicationInput = {
  companyName: string;
  jobTitle: string;
  jobLink?: string;
  platform?: string;
  status: string;
  dateApplied?: string;
  followUpDate?: string;
  notes?: string;
  tags?: string;
  salary?: string;
  location?: string;
};

export async function createApplication(data: ApplicationInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const app = await db.application.create({
      data: {
        ...data,
        userId: session.user.id,
        dateApplied: data.dateApplied ? new Date(data.dateApplied) : new Date(),
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
      },
    });
    revalidatePath("/");
    revalidatePath("/applications");
    return { success: true, data: app };
  } catch (error) {
    console.error("Failed to create application:", error);
    return { success: false, error: "Failed to create application" };
  }
}

export async function getApplications() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const apps = await db.application.findMany({
      where: { userId: session.user.id },
      orderBy: { dateApplied: "desc" },
    });
    return { success: true, data: apps };
  } catch (error) {
    console.error("Failed to get applications:", error);
    return { success: false, error: "Failed to fetch applications" };
  }
}

export async function getApplication(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const app = await db.application.findUnique({
      where: { id },
    });
    if (!app || app.userId !== session.user.id) return { success: false, error: "Not found" };
    return { success: true, data: app };
  } catch (error) {
    return { success: false, error: "Failed to fetch application" };
  }
}

export async function updateApplication(id: string, data: Partial<ApplicationInput>) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    // Verify ownership
    const existing = await db.application.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) return { success: false, error: "Not found" };

    const updateData: any = { ...data };
    if (data.dateApplied) updateData.dateApplied = new Date(data.dateApplied);
    if (data.followUpDate) updateData.followUpDate = new Date(data.followUpDate);
    
    const app = await db.application.update({
      where: { id },
      data: updateData,
    });
    revalidatePath("/");
    revalidatePath("/applications");
    revalidatePath(`/applications/${id}`);
    return { success: true, data: app };
  } catch (error) {
    return { success: false, error: "Failed to update application" };
  }
}

export async function updateApplicationStatus(id: string, status: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    // Verify ownership
    const existing = await db.application.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) return { success: false, error: "Not found" };

    const app = await db.application.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/");
    revalidatePath("/applications");
    return { success: true, data: app };
  } catch (error) {
    return { success: false, error: "Failed to update status" };
  }
}

export async function deleteApplication(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    // Verify ownership
    const existing = await db.application.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) return { success: false, error: "Not found" };

    await db.application.delete({
      where: { id },
    });
    revalidatePath("/");
    revalidatePath("/applications");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete application" };
  }
}
