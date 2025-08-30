"use client";

import { useQueries } from "@tanstack/react-query";
import { apiFetch } from "@/lib/http";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MediaList = { items?: any[]; total?: number };

const cards = [
  { key: "users", label: "Users", path: "/v1/users?skip=0&limit=5" },
  { key: "courses", label: "Courses", path: "/v1/courses?skip=0&limit=5" },
  { key: "projects", label: "Projects", path: "/v1/projects?skip=0&limit=5" },
  { key: "media", label: "Media", path: "/v1/media?skip=0&limit=1" },
];

export function KPIs() {
  const results = useQueries({
    queries: cards.map((c) => ({
      queryKey: ["kpi", c.key],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryFn: async () => apiFetch<any>(c.path),
    })),
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c, idx) => {
        const r = results[idx];
        let value = "—";
        if (r.data) {
          if (c.key === "media") {
            const ml = r.data as MediaList;
            if (typeof ml?.total === "number") value = String(ml.total);
            else if (Array.isArray(ml?.items)) value = String(ml.items.length);
          } else if (Array.isArray(r.data)) {
            value = String(r.data.length);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } else if (Array.isArray((r.data as any)?.items)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value = String((r.data as any).items.length);
          }
        }
        return (
          <div key={c.key} className="rounded-md border p-4">
            <div className="text-xs text-muted-foreground">{c.label}</div>
            <div className="text-2xl font-semibold mt-1">
              {r.isLoading ? "…" : value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
