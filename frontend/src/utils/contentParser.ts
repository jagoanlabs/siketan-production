/**
 * Helper utility to normalize, sanitize, and validate rich text content
 * for Quill / ReactQuill editors and HTML previews.
 */

/**
 * Escapes special HTML characters in a string
 */
export const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Decodes HTML entities back to raw HTML characters (e.g. &lt;p&gt; -> <p>)
 */
export const decodeHtmlEntities = (str: string): string => {
  if (!str) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
};

/**
 * Converts a Quill Delta ops array to HTML string
 */
export const convertDeltaOpsToHtml = (ops: any[]): string => {
  if (!Array.isArray(ops) || ops.length === 0) return "";

  let html = "";
  for (const op of ops) {
    if (typeof op.insert === "string") {
      let text = escapeHtml(op.insert);
      if (op.attributes?.bold) text = `<strong>${text}</strong>`;
      if (op.attributes?.italic) text = `<em>${text}</em>`;
      if (op.attributes?.underline) text = `<u>${text}</u>`;
      if (op.attributes?.strike) text = `<s>${text}</s>`;
      if (op.attributes?.link) {
        text = `<a href="${encodeURI(op.attributes.link)}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      }
      html += text.replace(/\n/g, "<br>");
    } else if (op.insert?.image) {
      html += `<img src="${encodeURI(op.insert.image)}" alt="Content image" />`;
    }
  }

  // Wrap in paragraph if not empty
  if (html.trim()) {
    return `<p>${html}</p>`;
  }
  return "";
};

/**
 * Normalizes content from various formats (plain text, JSON delta, HTML entities, etc.)
 * into valid HTML suitable for ReactQuill.
 */
export const normalizeRichTextContent = (content: any): string => {
  if (content === null || content === undefined) {
    return "";
  }

  // If content is already a Quill Delta object with ops
  if (typeof content === "object" && Array.isArray(content.ops)) {
    return convertDeltaOpsToHtml(content.ops);
  }

  if (typeof content !== "string") {
    return String(content);
  }

  let text = content.trim();
  if (!text) {
    return "";
  }

  // 1. Detect if content is a stringified JSON Delta: {"ops": [...]} or [{"insert": ...}]
  if (
    (text.startsWith("{") && text.includes('"ops"')) ||
    (text.startsWith("[") && text.includes('"insert"'))
  ) {
    try {
      const parsed = JSON.parse(text);
      if (parsed && Array.isArray(parsed.ops)) {
        const converted = convertDeltaOpsToHtml(parsed.ops);
        if (converted) return converted;
      } else if (Array.isArray(parsed)) {
        const converted = convertDeltaOpsToHtml(parsed);
        if (converted) return converted;
      }
    } catch {
      // Not valid JSON, continue with standard parsing
    }
  }

  // 2. Detect and decode HTML-entity encoded HTML (e.g. &lt;p&gt; or &lt;div&gt;)
  if (
    text.includes("&lt;p&gt;") ||
    text.includes("&lt;div&gt;") ||
    text.includes("&lt;span") ||
    text.includes("&lt;br") ||
    text.includes("&lt;h")
  ) {
    const decoded = decodeHtmlEntities(text);
    if (/<[a-z][\s\S]*>/i.test(decoded)) {
      text = decoded.trim();
    }
  }

  // 3. Check if content already contains HTML tags
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(text);
  if (hasHtmlTags) {
    return text;
  }

  // 4. Content is PLAIN TEXT (e.g. legacy news, direct DB seeds, or textarea inputs)
  // Convert newlines into paragraphs and <br> so Quill parses them properly
  const paragraphs = text
    .split(/\r?\n\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return `<p>${escapeHtml(text)}</p>`;
  }

  return paragraphs
    .map((p) => `<p>${escapeHtml(p).replace(/\r?\n/g, "<br>")}</p>`)
    .join("");
};

/**
 * Checks whether HTML content is truly empty (e.g. "", "<p><br></p>", or whitespace only)
 */
export const isContentEmpty = (html: string | null | undefined): boolean => {
  if (!html) return true;
  const stripped = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
  return stripped.length === 0;
};
