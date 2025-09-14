"use client";
import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";
import "github-markdown-css/github-markdown-dark.css";

export default function LessonContent({ content }: { content: string }) {
  const normalized = useMemo(
    () => (content ?? "").replace(/\r\n/g, "\n").replace(/\\n/g, "\n"),
    [content]
  );

  return (
    <article className="markdown-body mx-auto bg-card p-0 sm:p-6 rounded-xl border-0 sm:border text-justify">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeHighlight]}
      >
        {normalized}
      </ReactMarkdown>
    </article>
  );
}
