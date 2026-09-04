// components/RichTextEditor.tsx
import React, { useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { normalizeRichTextContent } from "@/utils/contentParser";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// Fixed formats array to prevent recreation on re-renders
const QUILL_FORMATS = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "align",
  "link",
  "image",
  "video",
  "code",
  "code-block",
  "script",
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Mulai menulis konten...",
  disabled = false,
  className = "",
}) => {
  // Ensure value is properly formatted HTML so Quill can parse it cleanly
  const normalizedValue = useMemo(
    () => normalizeRichTextContent(value),
    [value],
  );

  // Quill modules configuration
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ color: [] }, { background: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        [{ align: [] }],
        ["link", "image", "video"],
        ["clean"],
      ],
      clipboard: {
        matchVisual: false,
      },
    }),
    [],
  );

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <ReactQuill
        className={`
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          [&_.ql-editor]:min-h-[200px] 
          [&_.ql-editor]:max-h-[400px] 
          [&_.ql-editor]:overflow-y-auto
          [&_.ql-toolbar]:border-b-gray-200
          [&_.ql-container]:border-t-0
          [&_.ql-container]:font-sans
        `}
        formats={QUILL_FORMATS}
        modules={modules}
        placeholder={placeholder}
        readOnly={disabled}
        style={{
          fontSize: "14px",
        }}
        theme="snow"
        value={normalizedValue}
        onChange={onChange}
      />
    </div>
  );
};
