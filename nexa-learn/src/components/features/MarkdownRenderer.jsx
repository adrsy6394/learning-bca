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
        // Heading 1 - Premium Serif Style
        h1: ({ node, ...props }) => (
          <h1
            className="text-2xl font-serif text-[#0b2b24] mt-6 mb-4 flex items-center gap-2 border-b border-[#0b2b24]/10 pb-2"
            {...props}
          >
            {props.children}
          </h1>
        ),
        // Heading 2
        h2: ({ node, ...props }) => (
          <h2
            className="text-xl font-serif text-[#0b2b24]/80 mt-5 mb-3 flex items-center gap-2"
            {...props}
          >
            <BadgeCheck className="text-[#0b2b24]/40" size={18} />{" "}
            {props.children}
          </h2>
        ),
        // Heading 3
        h3: ({ node, ...props }) => (
          <h3
            className="text-lg font-bold text-[#0b2b24] mt-4 mb-2"
            {...props}
          >
            {props.children}
          </h3>
        ),
        // Paragraph styling
        p: ({ node, ...props }) => (
          <p
            className="text-sm leading-relaxed text-[#0b2b24]/80 mb-4 font-medium"
            {...props}
          />
        ),
        // Link styling
        a: ({ node, ...props }) => (
          <a
            className="text-[#0b2b24] underline decoration-[#d1e8c4] decoration-2 underline-offset-4 hover:text-black transition-all"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        // Unordered list
        ul: ({ node, ...props }) => (
          <ul
            className="list-none pl-2 text-[#0b2b24]/80 mb-4 space-y-2"
            {...props}
          />
        ),
        // List item with custom bullet
        li: ({ node, ...props }) => (
          <li className="flex items-start gap-2 text-sm" {...props}>
             <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#d1e8c4] shrink-0" />
             <span>{props.children}</span>
          </li>
        ),
        // Blockquote styling
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 pl-4 italic text-[#0b2b24]/60 border-[#d1e8c4] bg-[#fdf7e9] py-2 rounded-r-xl mb-4"
            {...props}
          />
        ),
        // Code blocks and inline code
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <div className="relative group">
              <SyntaxHighlighter
                style={atomOneDark}
                language={match[1]}
                PreTag="div"
                className="rounded-2xl my-4 overflow-x-auto text-[13px] shadow-lg border border-[#0b2b24]/5"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code
              className="bg-[#d1e8c4]/30 text-[#0b2b24] text-[13px] px-2 py-0.5 rounded-md font-mono font-bold"
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
