// LessonContent.tsx (Server Component — do NOT add "use client")
import React, { useMemo } from "react";
import { MarkdownAsync as ReactMarkdown } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypePrettyCode from "rehype-pretty-code";
import "github-markdown-css/github-markdown-dark.css";

interface Node {
  children: {
    length: number;
  };
}

const prettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark" },
  keepBackground: false,
  onVisitLine(node: Node) {
    if (node.children.length === 0)
      node.children = [{ type: "text", value: " " }];
  },
};

export default function LessonContent({ content }: { content: string }) {
  const normalized = useMemo(
    () => (content ?? "").replace(/\r\n/g, "\n").replace(/\\n/g, "\n"),
    [content]
  );

  return (
    <article className="markdown-body mx-auto bg-card p-6 rounded-xl border">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[[rehypePrettyCode, prettyCodeOptions]]}
      >
        {normalized}
      </ReactMarkdown>
    </article>
  );
}
