"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Briefcase,
  Settings,
  PlusCircle,
  BarChart,
  LogOut,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Applications", href: "/applications", icon: Briefcase },
  { name: "Analytics", href: "/analytics", icon: BarChart },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r border-[color:var(--border)] bg-[color:var(--card)] px-3 py-4">
      <div className="mb-8 flex items-center px-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--foreground)] text-[color:var(--background)]">
          <Briefcase size={18} />
        </div>
        <span className="ml-3 text-lg font-bold">Tracker</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
          return (
            <Link key={item.name} href={item.href}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[color:var(--muted)] text-[color:var(--foreground)]"
                    : "text-[color:var(--muted-foreground)] hover:bg-[color:var(--muted)]/50 hover:text-[color:var(--foreground)]"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive ? "text-[color:var(--foreground)]" : "text-[color:var(--muted-foreground)] group-hover:text-[color:var(--foreground)]"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-4 border-t border-[color:var(--border)]">
        <div className="px-3 pb-2 flex flex-col">
          <span className="text-sm font-medium text-[color:var(--foreground)] truncate">{user?.name || 'User'}</span>
          <span className="text-xs text-[color:var(--muted-foreground)] truncate">{user?.email}</span>
        </div>
        
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-[color:var(--muted-foreground)]" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-[color:var(--muted-foreground)]" />
          <span className="text-[color:var(--muted-foreground)]">Toggle Theme</span>
        </Button>
        
        <Button asChild className="w-full justify-start gap-2">
          <Link href="/applications/new">
            <PlusCircle size={18} />
            New Application
          </Link>
        </Button>

        <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => signOut()}>
          <LogOut size={18} />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
