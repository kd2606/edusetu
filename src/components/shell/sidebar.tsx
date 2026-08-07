"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutGrid, Route, Compass, BarChart3, Settings,
  Plus, Flame, Menu, GraduationCap,
} from "lucide-react";

const NAV = [
  { label: "Overview",    href: "/dashboard",           icon: LayoutGrid },
  { label: "My Roadmaps", href: "/dashboard/roadmaps",  icon: Route, count: 4 },
  { label: "Explore",     href: "/dashboard/explore",   icon: Compass },
  { label: "Progress",    href: "/dashboard/progress",  icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  return (
    <aside
      data-expanded={expanded}
      className="group/rail hidden shrink-0 flex-col bg-background
                 transition-[width] duration-300 ease-[var(--ease-emphasized)]
                 data-[expanded=false]:w-20 data-[expanded=true]:w-[280px] md:flex"
    >
      <div className="flex h-16 items-center gap-2 px-4">
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-label="Toggle navigation"
          className="grid size-12 place-items-center rounded-full text-on-surface-variant
                     transition-colors duration-150 hover:bg-surface-high active:bg-surface-highest"
        >
          <Menu className="size-5" strokeWidth={2} />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <GraduationCap className="size-6 shrink-0 text-primary" strokeWidth={2} />
          <span className="text-title-lg whitespace-nowrap text-on-surface
                           transition-opacity duration-200
                           group-data-[expanded=false]/rail:pointer-events-none
                           group-data-[expanded=false]/rail:opacity-0">
            Edu<span className="text-primary">Setu</span>
          </span>
        </Link>
      </div>

      <div className="px-3 py-2">
        <Link
          href="/"
          className="flex h-14 items-center gap-3 rounded-2xl bg-primary-container px-4
                     text-on-primary-container shadow-e1 transition-all duration-200
                     ease-[var(--ease-standard)] hover:shadow-e2
                     active:scale-[0.98] group-data-[expanded=false]/rail:justify-center
                     group-data-[expanded=false]/rail:px-0"
        >
          <Plus className="size-5 shrink-0" strokeWidth={2.5} />
          <span className="text-label whitespace-nowrap transition-opacity duration-150
                           group-data-[expanded=false]/rail:hidden">
            New Roadmap
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {NAV.map(({ label, href, icon: Icon, count }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              title={!expanded ? label : undefined}
              className={[
                "relative flex h-12 items-center gap-4 rounded-full px-4",
                "transition-colors duration-150 ease-[var(--ease-standard)]",
                "group-data-[expanded=false]/rail:justify-center group-data-[expanded=false]/rail:px-0",
                active
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface-variant hover:bg-surface-high active:bg-surface-highest",
              ].join(" ")}
            >
              <Icon className="size-5 shrink-0" strokeWidth={active ? 2.4 : 2} />
              <span className="text-label flex-1 whitespace-nowrap
                               group-data-[expanded=false]/rail:hidden">
                {label}
              </span>
              {count != null && (
                <span className="text-label-sm tabular-nums text-on-surface-muted
                                 group-data-[expanded=false]/rail:hidden">
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-3">
        <div className="rounded-xl border border-outline-variant bg-surface-container p-4
                        group-data-[expanded=false]/rail:flex
                        group-data-[expanded=false]/rail:justify-center
                        group-data-[expanded=false]/rail:p-2">
          <Flame className="size-5 shrink-0 text-progress" strokeWidth={2.2} />
          <div className="mt-3 group-data-[expanded=false]/rail:hidden">
            <p className="text-label-sm text-on-surface-muted">Current streak</p>
            <p className="text-title-lg mt-0.5 text-on-surface tabular-nums">12 days</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-highest">
              <div className="h-full rounded-full bg-primary" style={{ width: "68%" }} />
            </div>
            <p className="text-label-sm mt-2 text-on-surface-muted">2,480 / 3,600 XP</p>
          </div>
        </div>

        <Link
          href="/dashboard/settings"
          className="mt-1 flex h-12 items-center gap-4 rounded-full px-4 text-on-surface-variant
                     transition-colors hover:bg-surface-high
                     group-data-[expanded=false]/rail:justify-center group-data-[expanded=false]/rail:px-0"
        >
          <Settings className="size-5 shrink-0" strokeWidth={2} />
          <span className="text-label group-data-[expanded=false]/rail:hidden">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
