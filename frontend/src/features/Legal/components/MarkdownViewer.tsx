import React from "react";
import Markdown from "react-markdown";

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  content,
  className = "",
}) => {
  return (
    <div className={`prose prose-sm sm:prose lg:prose-lg max-w-none ${className}`}>
      <Markdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 mt-8" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 mt-8" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 mt-6" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-gray-600 leading-relaxed mb-4 text-sm sm:text-base text-justify" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-600" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-5 mb-4 space-y-2 text-gray-600" {...props} />
          ),
          li: ({ node, ...props }) => <li className="pl-2" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-green-500 pl-4 py-2 my-4 bg-gray-50 italic text-gray-700 rounded-r"
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-green-600 hover:text-green-700 underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-gray-900" {...props} />
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
