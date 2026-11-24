import mongoose from "mongoose";

// ============================================================================
// [YÊU CẦU CÔ - Backend Node.js kết nối Cơ sở dữ liệu MongoDB]
// Kết nối trực tiếp tới database `hanzi_master` (local :27017 hoặc MongoDB Atlas).
// Nếu chạy trên cloud (Render) chưa cấu hình MONGODB_URI, tự động bật chế độ
// dự phòng bộ nhớ từ seedData.json để toàn bộ 28 REST API vẫn hoạt động ổn định.
// ============================================================================
let mongoConnected = false;

export const isDatabaseConnected = () =>
  mongoConnected && mongoose.connection.readyState === 1;

export const connectDatabase = async ({ exitOnFail = false } = {}) => {
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hanzi_master";
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    mongoConnected = true;
    console.log(
      `✓ Đã kết nối MongoDB thành công: ${conn.connection.host}/${conn.connection.name}`
    );
    return conn;
  } catch (error) {
    mongoConnected = false;
    console.warn(
      `⚠ Không kết nối được MongoDB (${error.message}). Chuyển sang chế độ dự phòng bộ nhớ (seedData.json).`
    );
    if (exitOnFail) {
      process.exit(1);
    }
    return null;
  }
};
