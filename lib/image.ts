export const makeImageUrl = (path?: string | null) => {
  if (!path) return "";

  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000").replace(/\/+$/, "");
  const normalizedPath = String(path).replace(/\\/g, "/").replace(/^\/+/, "");

  return `${base}/uploads/${normalizedPath}`;
};