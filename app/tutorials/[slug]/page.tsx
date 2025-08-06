"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Calendar, User, ChevronRight } from "lucide-react";

const tutorials = {
  "complete-nextjs-15-guide": {
    title: "Complete Next.js 15 Guide",
    description:
      "Learn Next.js 15 from scratch with App Router, Server Components, and modern React patterns.",
    category: "Web Development",
    readTime: "45 min",
    publishedAt: "2024-01-15",
    author: "ASAAN HAI CODING Team",
    chapters: [
      { id: 1, title: "Introduction to Next.js 15", slug: "introduction" },
      {
        id: 2,
        title: "Setting Up Your Development Environment",
        slug: "setup",
      },
      { id: 3, title: "Understanding App Router", slug: "app-router" },
      {
        id: 4,
        title: "Server Components vs Client Components",
        slug: "components",
      },
      { id: 5, title: "Routing and Navigation", slug: "routing" },
      { id: 6, title: "Data Fetching Strategies", slug: "data-fetching" },
      { id: 7, title: "Styling with Tailwind CSS", slug: "styling" },
      { id: 8, title: "Building Your First Project", slug: "first-project" },
      { id: 9, title: "Deployment and Production", slug: "deployment" },
    ],
    content: {
      introduction: `# Introduction to Next.js 15

Welcome to the complete Next.js 15 guide! In this comprehensive tutorial, we'll explore everything you need to know about Next.js 15, from basic concepts to advanced patterns.

## What is Next.js?

Next.js is a powerful React framework that enables you to build full-stack web applications. It provides a great developer experience with features like:

- **Server-Side Rendering (SSR)**: Render pages on the server for better SEO and performance
- **Static Site Generation (SSG)**: Pre-render pages at build time
- **App Router**: A new routing system based on React Server Components
- **Built-in Optimization**: Automatic image, font, and script optimizations
- **TypeScript Support**: First-class TypeScript support out of the box

## What's New in Next.js 15?

Next.js 15 introduces several exciting features:

### 1. Stable App Router
The App Router is now stable and ready for production use. It provides:
- File-system based routing
- Layouts and nested routing
- Server and Client Components
- Streaming and Suspense support

### 2. Turbopack (Beta)
Turbopack is Vercel's new bundler written in Rust, offering:
- Up to 10x faster local development
- Incremental bundling
- Better error messages

### 3. Server Actions
Server Actions allow you to run server-side code directly from your components:

\`\`\`tsx
async function createUser(formData: FormData) {
  'use server'
  
  const name = formData.get('name')
  // Save to database
}

export default function UserForm() {
  return (
    <form action={createUser}>
      <input name="name" type="text" />
      <button type="submit">Create User</button>
    </form>
  )
}
\`\`\`

## Prerequisites

Before we dive in, make sure you have:
- Basic knowledge of React and JavaScript/TypeScript
- Node.js 18.17 or later installed
- A code editor (VS Code recommended)
- Basic understanding of HTML and CSS

## What You'll Build

Throughout this tutorial, we'll build a modern blog application with:
- Dynamic routing
- Server-side rendering
- Static generation
- API routes
- Authentication
- Database integration

Let's get started!`,

      setup: `# Setting Up Your Development Environment

Let's set up everything you need to start building with Next.js 15.

## Installing Node.js

First, ensure you have Node.js 18.17 or later installed:

\`\`\`bash
node --version
\`\`\`

If you need to install or update Node.js, visit [nodejs.org](https://nodejs.org/).

## Creating a New Next.js Project

The easiest way to create a new Next.js project is using \`create-next-app\`:

\`\`\`bash
npx create-next-app@latest my-nextjs-app
cd my-nextjs-app
\`\`\`

You'll be prompted with several options:
- **TypeScript**: Yes (recommended)
- **ESLint**: Yes
- **Tailwind CSS**: Yes
- **src/ directory**: Yes (optional)
- **App Router**: Yes (recommended)
- **Import alias**: No (or customize as needed)

## Project Structure

After creation, your project structure will look like this:

\`\`\`
my-nextjs-app/
├── src/
│   └── app/
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── public/
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
\`\`\`

## Key Files Explained

### \`src/app/layout.tsx\`
The root layout component that wraps all pages:

\`\`\`tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
\`\`\`

### \`src/app/page.tsx\`
The home page component:

\`\`\`tsx
export default function Home() {
  return (
    <main>
      <h1>Welcome to Next.js 15!</h1>
    </main>
  )
}
\`\`\`

## Running the Development Server

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see your application.

## Development Tools

### VS Code Extensions
Install these helpful extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag

### Browser DevTools
- React Developer Tools
- Next.js DevTools (coming soon)

You're now ready to start building with Next.js 15!`,
    },
  },
};

interface TutorialPageProps {
  params: {
    slug: string;
  };
}

export default function TutorialPage({ params }: TutorialPageProps) {
  const tutorial = tutorials[params.slug as keyof typeof tutorials];
  const [activeChapter, setActiveChapter] = useState("introduction");

  if (!tutorial) {
    notFound();
  }

  const currentContent =
    tutorial.content[activeChapter as keyof typeof tutorial.content] ||
    tutorial.content.introduction;

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            asChild
            variant="outline"
            className="border-slate-600 hover:bg-slate-800"
          >
            <Link href="/tutorials" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Tutorials</span>
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(tutorial.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{tutorial.readTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{tutorial.author}</span>
              </div>
              <Badge className="bg-purple-600 hover:bg-purple-700">
                {tutorial.category}
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {tutorial.title}
              </span>
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed">
              {tutorial.description}
            </p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900/50 border-slate-800 sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 text-white">
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {tutorial.chapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => setActiveChapter(chapter.slug)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                        activeChapter === chapter.slug
                          ? "bg-purple-600 text-white"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <span className="text-sm">{chapter.title}</span>
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${
                          activeChapter === chapter.slug
                            ? "rotate-90"
                            : "group-hover:translate-x-1"
                        }`}
                      />
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-8">
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                    {currentContent}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
