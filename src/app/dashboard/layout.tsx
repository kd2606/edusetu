import { Sidebar } from "@/components/shell/sidebar";
import { TopAppBar } from "@/components/shell/top-app-bar";
import { AuthButton } from "@/components/auth-button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-on-surface">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">
        <TopAppBar authButton={<AuthButton />} />
        <main className="min-h-0 flex-1 overflow-y-auto md:pr-3 md:pb-3 h-full">
          <div className="min-h-full rounded-none border-outline-variant bg-surface-low
                          md:rounded-2xl md:border shadow-sm flex flex-col relative overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
