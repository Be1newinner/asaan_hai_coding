import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ASAAN HAI CODING - Learn Programming the Easy Way",
  description:
    "Master programming with easy-to-follow tutorials, projects, and resources. From beginner to advanced, we make coding simple.",
  keywords:
    "programming, coding, tutorials, web development, mobile apps, python, nextjs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}
      >
        <QueryProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
