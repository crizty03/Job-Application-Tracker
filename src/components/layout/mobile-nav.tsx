"use client";

import { useState } from "react";
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
  Sun,
  Menu,
  X
} from "lucide-react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Applications", href: "/applications", icon: Briefcase },
  { name: "Analytics", href: "/analytics", icon: BarChart },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function MobileNav({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <>
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[color:var(--border)] bg-[color:var(--card)] z-40">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--foreground)] text-[color:var(--background)]">
            <Briefcase size={18} />
          </div>
          <span className="ml-3 text-lg font-bold">Tracker</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[color:var(--background)] p-4 md:hidden overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--foreground)] text-[color:var(--background)]">
                <Briefcase size={18} />
              </div>
              <span className="ml-3 text-lg font-bold">Tracker</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
              return (
                <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                  <span
                    className={cn(
                      "group flex items-center rounded-md px-3 py-4 text-base font-medium transition-colors",
                      isActive
                        ? "bg-[color:var(--muted)] text-[color:var(--foreground)]"
                        : "text-[color:var(--muted-foreground)] hover:bg-[color:var(--muted)]/50 hover:text-[color:var(--foreground)]"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-4 h-6 w-6 flex-shrink-0",
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

          <div className="mt-8 space-y-4 pt-6 border-t border-[color:var(--border)]">
            <div className="px-3 pb-4 flex flex-col">
              <span className="text-lg font-medium text-[color:var(--foreground)] truncate">{user?.name || 'User'}</span>
              <span className="text-sm text-[color:var(--muted-foreground)] truncate">{user?.email}</span>
            </div>
            
            <Button variant="ghost" className="w-full justify-start gap-3 h-14 text-base" onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); setIsOpen(false); }}>
              <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-[color:var(--muted-foreground)]" />
              <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-[color:var(--muted-foreground)]" />
              <span className="text-[color:var(--muted-foreground)]">Toggle Theme</span>
            </Button>
            
            <Button asChild className="w-full justify-start gap-3 h-14 text-base">
              <Link href="/applications/new" onClick={() => setIsOpen(false)}>
                <PlusCircle size={20} />
                New Application
              </Link>
            </Button>

            <Button variant="ghost" className="w-full justify-start gap-3 h-14 text-base text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => signOut()}>
              <LogOut size={20} />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
