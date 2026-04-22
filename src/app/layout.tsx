import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Tracker",
  description: "Personal Job Application Tracker",
  manifest: "/manifest.json",
  themeColor: "#09090b",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Job Tracker",
  },
};

import { Sidebar } from "@/components/layout/sidebar";

import { ThemeProvider } from "@/components/theme-provider";
import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex h-screen overflow-hidden bg-[color:var(--background)]">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {session && session.user && <Sidebar user={session.user} />}
          <main className="flex-1 overflow-y-auto bg-[color:var(--muted)]/30 p-8">
            <div className="mx-auto max-w-6xl">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
