import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { QueryProvider } from "../components/providers/query-client-provider";
import { Suspense } from "react";
import { ThemeProvider } from "../components/theme-provider";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Asaan Hai Coding Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-background text-foreground font-sans ${GeistSans.variable} ${GeistMono.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
