"use client";

import useAuthStore from "@/stores/auth-store";
import AppHeader from "../../components/protected/app-header";
import { AppSidebar } from "../../components/protected/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { getBusiness } from "@/apis/business";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, checkAuth, isAuthenticated } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user?.role === "user") {
      (async () => {
        const data = await getBusiness();
        if (!data.ok) {
          router.push("/setup");
        }
      })();
    }
  });

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {isAuthenticated && (
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <AppHeader />
            <div className="px-4 pt-5">{children}</div>
          </main>
        </SidebarProvider>
      )}
      <Toaster />
    </ThemeProvider>
  );
}
