import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { connectDatabase } from "../config/db.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { Voucher } from "../models/Voucher.js";
import { Plan } from "../models/Plan.js";
import { HskCourse } from "../models/HskCourse.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadSeedFile = () => {
  const seedPath = path.join(__dirname, "seedData.json");
  const raw = fs.readFileSync(seedPath, "utf8");
  return JSON.parse(raw);
};

// [YÊU CẦU CÔ - Script Khởi Tạo & Khôi Phục 7 Collections Mẫu Vào MongoDB (`npm run seed`)]
/** Tự động nạp dữ liệu mẫu lần đầu nếu các bảng trong MongoDB đang rỗng */
export const ensureSeedData = async () => {
  const productCount = await Product.countDocuments();
  if (productCount > 0) {
    return false;
  }

  const data = loadSeedFile();
  const totalOrders = (data.orders || []).length;
  const seededOrders = (data.orders || []).map((ord, idx) => ({
    ...ord,
    timestampMs: ord.timestampMs ?? (totalOrders - idx) * 1000,
  }));

  await Promise.all([
    Category.insertMany(data.categories || []),
    Product.insertMany(data.products || []),
    User.insertMany(data.users || []),
    Order.insertMany(seededOrders),
    Voucher.insertMany(data.vouchers || []),
    Plan.insertMany(data.plans || []),
    HskCourse.insertMany(data.hskCourses || []),
  ]);

  console.log("✓ Đã khởi tạo dữ liệu mẫu lần đầu vào MongoDB (hanzi_master).");
  return true;
};

/** Chạy lệnh `npm run seed` để làm mới toàn bộ dữ liệu mẫu trong MongoDB */
const runCliSeed = async () => {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });
  await connectDatabase({ exitOnFail: true });

  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    User.deleteMany({}),
    Order.deleteMany({}),
    Voucher.deleteMany({}),
    Plan.deleteMany({}),
    HskCourse.deleteMany({}),
  ]);

  await ensureSeedData();
  console.log("✓ Hoàn tất reset & seed toàn bộ 7 collections trong MongoDB!");
  process.exit(0);
};

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  runCliSeed().catch((err) => {
    console.error("✗ Lỗi khi seed dữ liệu MongoDB:", err);
    process.exit(1);
  });
}
