"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/components/state/ui-store";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/users", label: "Users" },
  { href: "/courses", label: "Courses" },
  { href: "/projects", label: "Projects" },
  { href: "/media", label: "Media Library" },
  { href: "/profile", label: "Profile" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <aside
      className={cn(
        "border-r bg-background",
        sidebarOpen ? "w-64" : "w-14",
        "transition-[width] duration-200 ease-in-out h-dvh sticky top-0"
      )}
      aria-label="Sidebar"
    >
      <div className="flex items-center justify-between px-3 h-12 border-b">
        <span
          className={cn("text-sm font-semibold", !sidebarOpen && "sr-only")}
        >
          Asaan Hai Coding
        </span>
        <button
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? "«" : "»"}
        </button>
      </div>
      <nav className="flex flex-col gap-1 p-2">
        {nav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm",
                active ? "bg-muted font-medium" : "hover:bg-muted"
              )}
            >
              <span className={cn(!sidebarOpen && "sr-only")}>
                {item.label}
              </span>
              <span className={cn(sidebarOpen && "sr-only")}>
                {item.label[0]}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
