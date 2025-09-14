"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Sparkles } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
const EarthCanvas = dynamic(() => import("./EarthCanvas"), { ssr: false });

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden max-w-7xl mx-auto">
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="flex items-center justify-center space-x-2 text-blue-400 mb-6">
            <Sparkles className="h-6 w-6" />
            <span className="text-sm font-medium tracking-wide uppercase">
              Welcome to the Future of Learning
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
              Coding Made
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
              Simple & Easy
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Master programming with our comprehensive tutorials, hands-on
            projects, and expert guidance. From beginner to advanced, we make
            coding accessible for everyone.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              <Link href="/courses" className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                <span>Start Learning</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3 text-lg"
            >
              <Link href="/projects">View Projects</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="h-full w-full max-w-125 aspect-square hidden sm:inline">
        <EarthCanvas />
      </div>
    </section>
  );
}
