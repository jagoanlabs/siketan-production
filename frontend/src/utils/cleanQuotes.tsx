export const cleanImageUrl = (url: string): string => {
  if (!url) return "";

  // Remove surrounding quotes and whitespace
  let cleanUrl = url.trim();

  // Remove double quotes from start and end
  if (cleanUrl.startsWith('"') && cleanUrl.endsWith('"')) {
    cleanUrl = cleanUrl.slice(1, -1);
  }

  // Remove single quotes from start and end
  if (cleanUrl.startsWith("'") && cleanUrl.endsWith("'")) {
    cleanUrl = cleanUrl.slice(1, -1);
  }

  // Remove any remaining whitespace
  cleanUrl = cleanUrl.trim();

  // Handle encoded quotes
  cleanUrl = cleanUrl.replace(/&quot;/g, "");
  cleanUrl = cleanUrl.replace(/&#34;/g, "");
  cleanUrl = cleanUrl.replace(/&#39;/g, "");

  // Handle multiple consecutive quotes
  cleanUrl = cleanUrl.replace(/["""''']+/g, "");

  console.log("🧹 URL cleaning:", { original: url, cleaned: cleanUrl });

  return cleanUrl;
};
