import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import QueryProvider from "@/components/providers/QueryProvider";
import UniverseBackground from "@/components/UniverseBackground";
import AnimatedCursor from "@/components/AnimatedCursor";

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
      <body className={`${inter.className} text-slate-100 antialiased`}>
        <UniverseBackground />
        <AnimatedCursor
          innerSize={8}
          outerSize={35}
          innerScale={1}
          outerScale={2}
          outerAlpha={0}
          // hasBlendMode={true}
          innerStyle={{
            backgroundColor: "var(--cursor-color)",
          }}
          outerStyle={{
            border: "3px solid var(--cursor-color)",
          }}
        />
        <QueryProvider>
          <Header />
          <main className="min-h-screen z-10">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
