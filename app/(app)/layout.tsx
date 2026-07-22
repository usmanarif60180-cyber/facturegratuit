import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppTopbar } from "@/components/layout/AppTopbar";
import { OnboardingOverlay } from "@/components/onboarding/OnboardingOverlay";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { PageTransition } from "@/components/motion/PageTransition";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <OnboardingOverlay />
      <GlobalSearch />
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar />
          <main className="flex-1 overflow-x-hidden p-4 md:p-6">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
