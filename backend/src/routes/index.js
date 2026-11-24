import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";
import {
  createUser,
  deleteUser,
  getAllUsers,
  login,
  register,
  updateUser,
} from "../controllers/auth.controller.js";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  updateOrder,
} from "../controllers/order.controller.js";
import {
  createVoucher,
  deleteVoucher,
  getAllVouchers,
  updateVoucher,
} from "../controllers/voucher.controller.js";
import {
  getAllHskCourses,
  getAllPlans,
  getHealth,
} from "../controllers/catalog.controller.js";
import { askAiTutor } from "../controllers/ai.controller.js";

const router = Router();

// ============================================================================
// [YÊU CẦU CÔ - Backend REST API Node.js / Express (Tổng 28 API cho FE & Admin)]
// Đầy đủ các phương thức GET, POST, PUT, DELETE thao tác trực tiếp trên MongoDB.
// ============================================================================

// Kiểm tra trạng thái kết nối MongoDB
router.get("/health", getHealth);

// Danh mục đào tạo (CRUD)
router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategoryById);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Khóa học (CRUD)
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Xác thực & Thành viên (Auth + CRUD)
router.post("/auth/login", login);
router.post("/auth/register", register);
router.get("/users", getAllUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Đơn ghi danh (CRUD)
router.get("/orders", getAllOrders);
router.post("/orders", createOrder);
router.put("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);

// Mã ưu đãi (CRUD)
router.get("/vouchers", getAllVouchers);
router.post("/vouchers", createVoucher);
router.put("/vouchers/:id", updateVoucher);
router.delete("/vouchers/:id", deleteVoucher);

// Gói học VIP & Khung HSK
router.get("/plans", getAllPlans);
router.get("/hskCourses", getAllHskCourses);

// Gia sư Thầy Giáo AI
router.post("/ai", askAiTutor);

export default router;
