import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./config/db.js";
import { ensureSeedData } from "./seed/seed.js";
import apiRoutes from "./routes/index.js";

dotenv.config();

// ============================================================================
// [YÊU CẦU CÔ - ASM Nhóm: Backend bằng Node.js + Express 5 + MongoDB]
// Khởi tạo REST API Server tại cổng 3001, cấu hình CORS cho phép Frontend
// (:3003) gọi sang, kết nối MongoDB (hanzi_master) và nạp dữ liệu mẫu tự động.
// ============================================================================
const app = express();
const PORT = Number(process.env.BACKEND_PORT || process.env.PORT) || 3001;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.use(express.json({ limit: "2mb" }));

// Trang giới thiệu gốc của Backend API
app.get("/", (_req, res) => {
  res.json({
    service: "HANZI MASTER Backend API",
    database: "MongoDB (Mongoose)",
    endpoints: [
      "/api/health",
      "/api/categories",
      "/api/products",
      "/api/auth/login",
      "/api/auth/register",
      "/api/users",
      "/api/orders",
      "/api/vouchers",
      "/api/plans",
      "/api/hskCourses",
      "/api/ai",
    ],
  });
});

// Mount REST API tại /api (và hỗ trợ đường dẫn gốc tương thích ngược)
app.use("/api", apiRoutes);
app.use("/", apiRoutes);

const startServer = async () => {
  const conn = await connectDatabase();
  if (conn) {
    await ensureSeedData();
  }

  app.listen(PORT, () => {
    console.log(`✓ Backend Node.js + MongoDB đang chạy tại http://localhost:${PORT}/api`);
  });
};

startServer();
