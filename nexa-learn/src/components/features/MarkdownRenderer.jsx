import React from "react";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import atomOneDark from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark";
import remarkGfm from "remark-gfm";
import { BadgeCheck,  Info, Star } from "lucide-react";

// register JavaScript syntax highlighting
SyntaxHighlighter.registerLanguage("javascript", js);

// Markdown renderer with custom styled components
const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      children={content} // markdown source
      remarkPlugins={[remarkGfm]} // support GitHub-flavored markdown (tables, strikethrough, etc.)
      components={{
        // Heading 1 with icon and gradient text
        h1: ({ node, ...props }) => (
          <h1
            className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent mt-6 mb-4 flex items-center gap-2"
            {...props}
          >
            <Star className="text-yellow-500" size={24} /> {props.children}
          </h1>
        ),
        // Heading 2 with badge icon
        h2: ({ node, ...props }) => (
          <h2
            className="text-2xl font-semibold text-purple-600 dark:text-purple-400 mt-5 mb-3 flex items-center gap-2"
            {...props}
          >
            <BadgeCheck className="text-purple-500" size={20} />{" "}
            {props.children}
          </h2>
        ),
        // Heading 3 with info icon
        h3: ({ node, ...props }) => (
          <h3
            className="text-xl font-semibold text-blue-600 dark:text-blue-400 mt-4 mb-2 flex items-center gap-2"
            {...props}
          >
            <Info className="text-blue-500" size={20} /> {props.children}
          </h3>
        ),
        // Paragraph styling
        p: ({ node, ...props }) => (
          <p
            className="text-base leading-relaxed text-gray-800 dark:text-gray-300 mb-3"
            {...props}
          />
        ),
        // Link styling with safe external behavior
        a: ({ node, ...props }) => (
          <a
            className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 transition-all duration-200"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        // Unordered list
        ul: ({ node, ...props }) => (
          <ul
            className="list-disc pl-5 text-gray-800 dark:text-gray-300 mb-3"
            {...props}
          />
        ),
        // Ordered list
        ol: ({ node, ...props }) => (
          <ol
            className="list-decimal pl-5 text-gray-800 dark:text-gray-300 mb-3"
            {...props}
          />
        ),
        // List item spacing
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        // Blockquote styling
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 pl-4 italic text-gray-600 dark:text-gray-400 border-gray-400 dark:border-gray-600 mb-4"
            {...props}
          />
        ),
        // Table container styling
        table: ({ node, ...props }) => (
          <table
            className="table-auto border-collapse border border-gray-400 dark:border-gray-600 mb-4 w-full text-left"
            {...props}
          />
        ),
        // Table head styling
        thead: ({ node, ...props }) => (
          <thead className="bg-gray-200 dark:bg-gray-700" {...props} />
        ),
        // Table body (default)
        tbody: ({ node, ...props }) => <tbody {...props} />,
        // Table row styling
        tr: ({ node, ...props }) => (
          <tr
            className="border-b border-gray-300 dark:border-gray-600"
            {...props}
          />
        ),
        // Table header cell styling
        th: ({ node, ...props }) => (
          <th
            className="border border-gray-400 dark:border-gray-600 px-4 py-2 font-semibold text-gray-900 dark:text-gray-100"
            {...props}
          />
        ),
        // Table data cell styling
        td: ({ node, ...props }) => (
          <td
            className="border border-gray-400 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-300"
            {...props}
          />
        ),
        // Code blocks and inline code handling
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || ""); // detect language class
          return !inline && match ? (
            // Syntax-highlighted block
            <div>
              <SyntaxHighlighter
                style={atomOneDark}
                language={match[1]}
                PreTag="div"
                className="rounded-xl my-4 overflow-x-auto text-sm"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          ) : (
            // Inline code styling
            <code
              className="bg-gray-300 dark:bg-gray-700 text-sm px-1.5 py-0.5 rounded-md font-mono text-pink-600 dark:text-pink-300 hover:scale-[1.02] transition"
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    />
  );
};

export default MarkdownRenderer;
