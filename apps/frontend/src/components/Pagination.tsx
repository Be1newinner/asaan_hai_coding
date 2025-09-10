"use client";

import * as React from "react";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type Props = {
  totalPages: number;
  currentPage: number;
  makeHref?: (page: number) => string;
  className?: string;
};

export function PaginationDark({
  totalPages,
  currentPage,
  makeHref = (p) => `?page=${p}`,
  className,
}: Props) {
  const page = Math.max(1, Math.min(currentPage, totalPages)) || 1;

  const windowSize = 1;
  const pages: (number | "...")[] = [];

  const push = (v: number | "...") => pages.push(v);

  const addRange = (start: number, end: number) => {
    for (let i = start; i <= end; i++) push(i);
  };

  if (totalPages <= 7) {
    addRange(1, totalPages);
  } else {
    const left = Math.max(2, page - windowSize);
    const right = Math.min(totalPages - 1, page + windowSize);

    push(1);
    if (left > 2) push("...");
    addRange(left, right);
    if (right < totalPages - 1) push("...");
    push(totalPages);
  }

  return (
    <div
      className={[
        "w-full flex justify-center",
        "bg-[--card] text-[--foreground] shadow-sm",
        "p-2 md:p-3 mt-8",
        className ?? "",
      ].join(" ")}
      style={
        {
          ["--card" as any]: "oklch(17% 0.02 260)",
          ["--foreground" as any]: "oklch(98% 0.01 260)",
          ["--muted" as any]: "oklch(25% 0.02 260)",
          ["--muted-foreground" as any]: "oklch(80% 0.02 260)",
          ["--accent" as any]: "oklch(30% 0.05 260)",
          ["--accent-foreground" as any]: "oklch(98% 0.01 260)",
          ["--ring" as any]: "oklch(65% 0.15 260)",
          ["--border" as any]: "oklch(28% 0.02 260)",
          ["--hover" as any]: "oklch(22% 0.02 260)",
          ["--active" as any]: "oklch(35% 0.08 260)",
        } as React.CSSProperties
      }
    >
      <Pagination>
        <PaginationContent className="gap-1">
          <PaginationItem>
            <Link
              href={page > 1 ? makeHref(page - 1) : ""}
              aria-disabled={page === 1}
              className={page > 1 ? "text-white" : "text-slate-700"}
            >
              {"<"} Previous
            </Link>
          </PaginationItem>

          {pages.map((p, idx) =>
            p === "..." ? (
              <PaginationItem key={`e-${idx}`}>
                <PaginationEllipsis className="text-[--muted-foreground]" />
              </PaginationItem>
            ) : (
              <PaginationItem key={p} className="">
                <Link
                  className={[
                    "data-[state=active]:bg-[--active] data-[state=active]:text-[--accent-foreground]",
                    "hover:bg-[--hover] px-4 py-3",
                    p === page ? "rounded border border-[--ring]" : "border-0",
                  ].join(" ")}
                  href={makeHref(p)}
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </Link>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <Link
              href={page < totalPages ? makeHref(page + 1) : ""}
              aria-disabled={page >= totalPages}
              className={page < totalPages ? "" : "text-slate-700"}
            >
              Next {">"}
            </Link>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
