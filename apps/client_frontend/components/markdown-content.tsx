"use client"

import type React from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface MarkdownContentProps {
  content: string
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  return (
    <ReactMarkdown
      className="prose prose-invert prose-lg max-w-none"
      components={{
        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-6 mb-3" {...props} />,
        p: ({ node, ...props }) => <p className="my-4 leading-relaxed" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-4" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-4" {...props} />,
        li: ({ node, ...props }) => <li className="my-1" {...props} />,
        a: ({ node, ...props }) => <a className="text-purple-400 hover:text-purple-300 underline" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-purple-500 pl-4 italic my-4 text-gray-400" {...props} />
        ),
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "")
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              className="rounded-md my-4"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm" {...props}>
              {children}
            </code>
          )
        },
        img: ({ node, ...props }) => <img className="rounded-lg max-w-full my-6" {...props} alt={props.alt || ""} />,
        hr: ({ node, ...props }) => <hr className="my-8 border-gray-700" {...props} />,
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-6">
            <table className="min-w-full divide-y divide-gray-700" {...props} />
          </div>
        ),
        thead: ({ node, ...props }) => <thead className="bg-gray-800" {...props} />,
        th: ({ node, ...props }) => (
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider" {...props} />
        ),
        td: ({ node, ...props }) => <td className="px-4 py-3 text-sm" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default MarkdownContent
