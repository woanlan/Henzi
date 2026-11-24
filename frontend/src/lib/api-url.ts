// ============================================================================
// [YÊU CẦU CÔ - Cấu hình địa chỉ REST API cho cả Localhost & Deploy Render]
// - Localhost: dùng NEXT_PUBLIC_API_URL trong .env.local (http://localhost:3001/api)
// - Cloud Render (1 Web Service): trình duyệt gọi "/api" (Next.js rewrites
//   proxy nội bộ sang Express Backend :3001), còn SSR gọi trực tiếp 127.0.0.1:3001/api.
// ============================================================================
export function getApiUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "/api";
  }
  return (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:3001/api"
  );
}
