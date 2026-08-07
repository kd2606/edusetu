"use client";

import { Search, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
export function TopAppBar({ authButton }: { authButton?: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 px-4 md:px-6
                       supports-[backdrop-filter]:bg-[var(--color-glass)]
                       supports-[backdrop-filter]:backdrop-blur-xl bg-background border-b border-outline-variant">
      <div className="relative w-full max-w-[720px]">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px]
                           -translate-y-1/2 text-on-surface-muted" strokeWidth={2} />
        <input
          type="search"
          placeholder="Search topics, roadmaps or subjects"
          className="text-body h-12 w-full rounded-full border border-transparent
                     bg-surface-container pl-12 pr-4 text-on-surface
                     placeholder:text-on-surface-muted outline-none
                     transition-[background-color,box-shadow,border-color] duration-200
                     hover:bg-surface-high
                     focus:border-outline-variant focus:bg-surface focus:shadow-e2"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {mounted && (
          <IconButton label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="size-5" strokeWidth={2} /> : <Moon className="size-5" strokeWidth={2} />}
          </IconButton>
        )}

        <IconButton label="Notifications">
          <Bell className="size-5" strokeWidth={2} />
          <span className="absolute right-3 top-3 size-2 rounded-full bg-error
                           ring-2 ring-background" />
        </IconButton>

        {authButton}
      </div>
    </header>
  );
}

function IconButton({ children, label, onClick }: {
  children: React.ReactNode; label: string; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="relative grid size-11 place-items-center rounded-full text-on-surface-variant
                 transition-colors duration-150 hover:bg-surface-high active:bg-surface-highest"
    >
      {children}
    </button>
  );
}
