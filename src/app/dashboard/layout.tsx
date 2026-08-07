import { ReactNode } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Library, Map as MapIcon, Settings } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[hsl(var(--bg-base))] pt-[var(--header-h)]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[hsl(var(--stroke-subtle))] bg-[hsl(var(--bg-surface))] px-4 py-6 fixed h-[calc(100vh-var(--header-h))]">
        <nav className="space-y-2 flex-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[hsl(var(--text-primary))] bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--stroke-default))] shadow-rim">
            <LayoutDashboard className="w-4 h-4 text-accent" />
            Overview
          </Link>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--bg-elevated))] transition-colors">
            <MapIcon className="w-4 h-4" />
            My Roadmaps
          </Link>
          <Link href="/dashboard/resources" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--bg-elevated))] transition-colors">
            <Library className="w-4 h-4" />
            Resources
          </Link>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-[hsl(var(--stroke-subtle))]">
           <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--bg-elevated))] transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
