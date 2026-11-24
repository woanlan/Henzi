"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { SWR_KEYS, useBackendHealthSWR } from "@/hooks/useSwrApi";
import { useAppDispatch } from "@/store";
import { clearReduxUser } from "@/store/slices/authSlice";
import { IProduct } from "@/interfaces/product";
import { ICategory } from "@/interfaces/category";
import { IUser } from "@/interfaces/user";
import { IOrder, IOrderItem, IVoucher, OrderStatus } from "@/interfaces/order";
import {
  AUTH_CHANGE_EVENT,
  clearCurrentUser,
  createUserAccount,
  deleteUserAccount,
  getAllUsers,
  getSavedUser,
  updateUserAccount,
} from "@/services/auth.service";
import {
  checkJsonServerHealth,
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "@/services/product.service";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "@/services/category.service";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  updateOrder,
} from "@/services/order.service";
import {
  createVoucher,
  deleteVoucher,
  getAllVouchers,
  updateVoucher,
} from "@/services/voucher.service";
import AdminOverview, { AdminSectionId } from "./AdminOverview";
import AdminOrdersSection from "./AdminOrdersSection";
import AdminUsersSection from "./AdminUsersSection";
import AdminVouchersSection from "./AdminVouchersSection";
import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  FolderKanban,
  Users,
  Ticket,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
  Database,
  ExternalLink,
  LogOut,
  ShieldAlert,
  Lock,
  ArrowLeft,
  ArrowUpRight,
  Menu,
} from "lucide-react";
// [YÊU CẦU CÔ - Lab 4 (Form Validation)] Import các hàm bắt lỗi dùng chung cho Khóa học & Danh mục
import {
  validateMinLength,
  validatePrice,
  validatePositiveInt,
  validateHexColor,
  hasErrors,
} from "@/lib/validation";

interface ProductFormState {
  id: string;
  name: string;
  author: string;
  pages: string;
  categoryId: string;
  price: string;
  originalPrice: string;
  period: string;
  duration: string;
  level: string;
  badge: string;
  image: string;
  desc: string;
  featuresText: string;
}

interface CategoryFormState {
  id: string;
  name: string;
  slug: string;
  badge: string;
  count: string;
  color: string;
  description: string;
}

interface DeleteTarget {
  type: "products" | "categories" | "orders" | "users" | "vouchers";
  id: string | number;
  name: string;
}

const PRESET_COURSE_IMAGES = [
  { label: "HSK 1", url: "/images/book-covers/hsk-1.jpg" },
  { label: "HSK 4", url: "/images/book-covers/hsk-4.jpg" },
  { label: "HSK 5", url: "/images/book-covers/hsk-5.jpg" },
  { label: "HSK 6", url: "/images/book-covers/hsk-6.jpg" },
  { label: "Ngữ pháp", url: "/images/book-covers/grammar-all.jpg" },
  { label: "5000 Từ", url: "/images/book-covers/vocab-5000-srs.jpg" },
  { label: "214 Bộ thủ", url: "/images/book-covers/radicals-214.jpg" },
  { label: "500 Tượng hình", url: "/images/book-covers/pictograph-500.jpg" },
  { label: "301 Đàm thoại", url: "/images/book-covers/comm-301.jpg" },
  { label: "Logistics XNK", url: "/images/book-covers/biz-logistics.jpg" },
  { label: "100 Thành ngữ", url: "/images/book-covers/idioms-chengyu.jpg" },
  { label: "300 Thơ Đường", url: "/images/book-covers/tang-poetry-300.jpg" },
];

const EMPTY_PRODUCT_FORM: ProductFormState = {
  id: "",
  name: "",
  author: "Ban Biên Tập HANZI",
  pages: "260",
  categoryId: "hsk",
  price: "169.000₫",
  originalPrice: "210.000₫",
  period: "Bìa mềm & Bìa cứng",
  duration: "260 trang · Giấy kem 100gsm",
  level: "HSK 3.0 · Sơ trung cấp",
  badge: "Ấn Phẩm Mới",
  image: "/images/book-covers/hsk-1.jpg",
  desc: "",
  featuresText:
    "In 2 màu trên giấy kem 100gsm chống mỏi mắt\nTặng kèm bookmark lụa đỏ & mã QR Audio Bắc Kinh\nCó đủ 2 phiên bản Bìa mềm và Bìa cứng khâu chỉ",
};

const EMPTY_CATEGORY_FORM: CategoryFormState = {
  id: "",
  name: "",
  slug: "",
  badge: "Chuyên đề",
  count: "3",
  color: "#D97706",
  description: "",
};

// ============================================================================
// [YÊU CẦU CÔ - Trang Quản Trị Admin Đầy Đủ CRUD bằng React + MongoDB]
// Tích hợp đầy đủ các kiến thức trong lộ trình môn học:
// 1. Component & Props: Chia 6 phân hệ, truyền dữ liệu & hàm xử lý xuống con
// 2. useState + Form (Lab 4): Quản lý bảng dữ liệu, tìm kiếm & Modal Thêm/Sửa/Xóa
// 3. useEffect: Khởi tạo phiên Admin, tải dữ liệu REST API & bắt phím tắt Escape
// 4. useMemo: Tối ưu lọc tìm kiếm khóa học, danh mục và bảng tra cứu O(1)
// 5. useSWR: Kiểm tra tự động kết nối MongoDB (:3001) & đồng bộ cache qua mutate()
// 6. Redux Toolkit: Đồng bộ đăng xuất quản trị viên trên Global Store
// ============================================================================
export default function AdminDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { mutate: mutateSwrCache } = useSWRConfig();

  // 1. STATE KIỂM TRA PHÂN QUYỀN ADMIN
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  // [YÊU CẦU CÔ - useSWR]: Tự động kiểm tra trạng thái kết nối MongoDB (:3001)
  const { isOnline: isSwrOnline, recheckHealth } = useBackendHealthSWR(
    authChecked && currentUser?.role === "admin"
  );

  // 2. STATE ĐIỀU HƯỚNG DASHBOARD & DRAWER DI ĐỘNG
  const [activeSection, setActiveSection] = useState<AdminSectionId>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // 3. STATE DỮ LIỆU TOÀN HỆ THỐNG (5 BẢNG CRUD)
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [vouchers, setVouchers] = useState<IVoucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string>("");
  const [isApiOnline, setIsApiOnline] = useState<boolean>(false);

  // Bộ lọc cho Khóa học & Danh mục
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

  // Modal Khóa học & Danh mục & Xóa
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProductId, setEditingProductId] = useState<string | number | null>(null);
  const [productForm, setProductForm] = useState<ProductFormState>(EMPTY_PRODUCT_FORM);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | number | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(EMPTY_CATEGORY_FORM);

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");
  // [YÊU CẦU CÔ - Lab 4 (Form Validation)] State lưu lỗi từng trường cho Modal Khóa học & Danh mục
  const [productFieldErrors, setProductFieldErrors] = useState<Record<string, string>>({});
  const [categoryFieldErrors, setCategoryFieldErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  useEffect(() => {
    const syncAuth = () => {
      setCurrentUser(getSavedUser());
      setAuthChecked(true);
    };

    syncAuth();
    window.addEventListener(AUTH_CHANGE_EVENT, syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  // [YÊU CẦU CÔ - useCallback + Fetch REST API song song từ Backend MongoDB]
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [online, prodList, catList, ordList, usrList, vchList] = await Promise.all([
        checkJsonServerHealth(),
        getAllProducts(),
        getAllCategories(),
        getAllOrders(),
        getAllUsers(),
        getAllVouchers(),
      ]);
      setIsApiOnline(online);
      setProducts(prodList);
      setCategories(catList);
      setOrders(ordList);
      setUsers(usrList);
      setVouchers(vchList);
      recheckHealth();
    } catch {
      setLoadError("Không thể tải dữ liệu quản trị. Vui lòng bấm Làm mới.");
    } finally {
      setLoading(false);
    }
  }, [recheckHealth]);

  // [YÊU CẦU CÔ - useEffect]: Tự động tải dữ liệu khi xác nhận tài khoản là Admin
  useEffect(() => {
    if (authChecked && currentUser?.role === "admin") {
      fetchAllData();
    }
  }, [authChecked, currentUser?.role, fetchAllData]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) {
        setIsProductModalOpen(false);
        setIsCategoryModalOpen(false);
        setDeleteTarget(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [submitting]);

  const handleAdminLogout = () => {
    clearCurrentUser();
    dispatch(clearReduxUser());
    setCurrentUser(null);
    router.push("/login");
  };

  const handleSwitchToAdminAccount = () => {
    clearCurrentUser();
    dispatch(clearReduxUser());
    setCurrentUser(null);
    router.push("/login?redirect=/admin");
  };

  const navigateSection = (sec: AdminSectionId) => {
    setActiveSection(sec);
    setSearchTerm("");
    setMobileMenuOpen(false);
  };

  // ================= DỮ LIỆU DẪN XUẤT GHI NHỚ BẰNG useMemo =================
  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return products.filter((item) => {
      const matchesCategory =
        selectedCategoryFilter === "all" ||
        String(item.categoryId) === selectedCategoryFilter;
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        String(item.id).toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategoryFilter, searchTerm]);

  const filteredCategories = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return categories.filter(
      (cat) =>
        !q ||
        cat.name.toLowerCase().includes(q) ||
        cat.slug.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q)
    );
  }, [categories, searchTerm]);

  const categoryLabelMap = useMemo(
    () => new Map(categories.map((c) => [String(c.id), c.name])),
    [categories]
  );

  const getCategoryLabel = useCallback(
    (categoryId: string | number): string =>
      categoryLabelMap.get(String(categoryId)) ?? String(categoryId),
    [categoryLabelMap]
  );

  const pendingOrdersCount = useMemo(
    () => orders.filter((o) => o.status === "pending").length,
    [orders]
  );

  // ==========================================================================
  // [YÊU CẦU CÔ - Phân Quyền Quản Trị RBAC: Chặn Khách & Chặn Học Viên (403)]
  // Chỉ tài khoản có `role === "admin"` (admin / 123) mới vào được Dashboard.
  // ==========================================================================
  if (!authChecked) {
    return (
      <div
        role="status"
        aria-busy="true"
        className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-6"
      >
        <div className="text-sm font-semibold text-stone-500">
          Đang kiểm tra quyền truy cập quản trị...
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 p-7 space-y-5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-black text-stone-900 tracking-tight">
              Khu Vực Quản Trị Hệ Thống
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Trang quản trị nằm tách biệt với giao diện độc giả và chỉ dành cho tài khoản{" "}
              <strong className="text-stone-900">Admin</strong>. Vui lòng đăng nhập để tiếp tục.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
            Tài khoản quản trị hiệu sách mặc định:{" "}
            <strong className="font-mono text-stone-900">admin / 123</strong>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-xs sm:text-sm font-bold text-stone-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Về trang chủ</span>
            </Link>
            <Link
              href="/login?redirect=/admin"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold transition-colors"
            >
              <span>Đăng nhập Admin</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 p-7 space-y-5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-black text-stone-900 tracking-tight">
              Không Có Quyền Truy Cập (403)
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Tài khoản <strong className="text-stone-900">{currentUser.username}</strong> đang ở
              vai trò <strong className="text-stone-900">Độc giả</strong>. Chỉ tài khoản{" "}
              <strong className="text-stone-900">Admin</strong> mới được phép quản trị hệ thống.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-xs sm:text-sm font-bold text-stone-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Về Hiệu Sách</span>
            </Link>
            <button
              type="button"
              onClick={handleSwitchToAdminAccount}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              <span>Đổi sang Admin</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= HANDLERS KHÓA HỌC & DANH MỤC =================
  const openCreateProductModal = () => {
    setEditingProductId(null);
    setProductForm({
      ...EMPTY_PRODUCT_FORM,
      categoryId: categories[0] ? String(categories[0].id) : "hsk",
    });
    setFormError("");
    setProductFieldErrors({});
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: IProduct) => {
    setEditingProductId(product.id);
    setProductForm({
      id: String(product.id),
      name: product.name,
      author: product.author || "Ban Biên Tập HANZI",
      pages: String(product.pages || 240),
      categoryId: String(product.categoryId),
      price: product.price,
      originalPrice: product.originalPrice || "",
      period: product.period || "Bìa mềm & Bìa cứng",
      duration: product.duration || "240 trang · Giấy kem",
      level: product.level || "HSK 3.0",
      badge: product.badge || "",
      image: product.image || "/images/book-covers/hsk-1.jpg",
      desc: product.desc,
      featuresText: (product.features || []).join("\n"),
    });
    setFormError("");
    setProductFieldErrors({});
    setIsProductModalOpen(true);
  };

  const handleProductInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
    setFormError("");
    setProductFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // [YÊU CẦU CÔ - CRUD Đầu sách (CREATE POST & UPDATE PUT lên MongoDB)]
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // [YÊU CẦU CÔ - Lab 4 (Form Validation)] Kiểm tra bắt lỗi nhập thiếu / sai định dạng Đầu sách
    const errors: Record<string, string> = {
      name: validateMinLength(productForm.name, 3, "Tên đầu sách"),
      price: validatePrice(productForm.price, "Giá bán bìa mềm"),
      pages: validatePositiveInt(productForm.pages, 16, "Số trang in"),
      desc: validateMinLength(productForm.desc, 10, "Mô tả tóm tắt"),
    };

    if (hasErrors(errors)) {
      setProductFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setFormError("");
    setProductFieldErrors({});
    const features = productForm.featuresText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const parsedPages = Number.parseInt(productForm.pages, 10) || 240;

    const payload = {
      name: productForm.name.trim(),
      author: productForm.author.trim() || "Ban Biên Tập HANZI",
      pages: parsedPages,
      categoryId: productForm.categoryId,
      categoryName: getCategoryLabel(productForm.categoryId),
      price: productForm.price.trim(),
      originalPrice: productForm.originalPrice.trim() || undefined,
      period: productForm.period.trim() || "Bìa mềm & Bìa cứng",
      duration: productForm.duration.trim() || `${parsedPages} trang · Giấy kem`,
      level: productForm.level.trim() || "HSK 3.0",
      badge: productForm.badge.trim() || undefined,
      image: productForm.image.trim() || "/images/book-covers/hsk-1.jpg",
      desc: productForm.desc.trim(),
      fullDesc: productForm.desc.trim(),
      features,
    };

    try {
      if (editingProductId !== null) {
        const { product, source } = await updateProduct(editingProductId, payload);
        setProducts((prev) =>
          prev.map((p) => (String(p.id) === String(editingProductId) ? product : p))
        );
        setIsApiOnline(source === "api");
        setNotice({ type: "success", message: `Đã cập nhật đầu sách "${product.name}".` });
      } else {
        const { product, source } = await createProduct({
          ...payload,
          id: productForm.id.trim() || undefined,
        });
        setProducts((prev) => [product, ...prev]);
        setIsApiOnline(source === "api");
        setNotice({ type: "success", message: `Đã thêm đầu sách mới "${product.name}".` });
      }
      setIsProductModalOpen(false);
      mutateSwrCache(SWR_KEYS.PRODUCTS);
    } catch {
      setFormError("Không thể lưu đầu sách. Vui lòng kiểm tra lại dữ liệu.");
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateCategoryModal = () => {
    setEditingCategoryId(null);
    setCategoryForm(EMPTY_CATEGORY_FORM);
    setFormError("");
    setCategoryFieldErrors({});
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: ICategory) => {
    setEditingCategoryId(cat.id);
    setCategoryForm({
      id: String(cat.id),
      name: cat.name,
      slug: cat.slug,
      badge: cat.badge || "",
      count: String(cat.count ?? 0),
      color: cat.color || "#D97706",
      description: cat.description,
    });
    setFormError("");
    setCategoryFieldErrors({});
    setIsCategoryModalOpen(true);
  };

  const handleCategoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({ ...prev, [name]: value }));
    setFormError("");
    setCategoryFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // [YÊU CẦU CÔ - CRUD Danh mục (CREATE POST & UPDATE PUT lên MongoDB)]
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    // [YÊU CẦU CÔ - Lab 4 (Form Validation)] Kiểm tra bắt lỗi nhập thiếu / sai định dạng Danh mục
    const errors: Record<string, string> = {
      name: validateMinLength(categoryForm.name, 3, "Tên danh mục"),
      color: validateHexColor(categoryForm.color),
      description: validateMinLength(categoryForm.description, 10, "Mô tả danh mục"),
    };

    if (hasErrors(errors)) {
      setCategoryFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setFormError("");
    setCategoryFieldErrors({});
    const payload = {
      name: categoryForm.name.trim(),
      slug: categoryForm.slug.trim(),
      badge: categoryForm.badge.trim() || "Chuyên đề",
      count: Number.parseInt(categoryForm.count, 10) || 0,
      color: categoryForm.color.trim() || "#D97706",
      description: categoryForm.description.trim(),
    };

    try {
      if (editingCategoryId !== null) {
        const { category, source } = await updateCategory(editingCategoryId, payload);
        setCategories((prev) =>
          prev.map((c) => (String(c.id) === String(editingCategoryId) ? category : c))
        );
        setIsApiOnline(source === "api");
        setNotice({ type: "success", message: `Đã cập nhật danh mục "${category.name}".` });
      } else {
        const { category, source } = await createCategory({
          ...payload,
          id: categoryForm.id.trim() || undefined,
        });
        setCategories((prev) => [category, ...prev]);
        setIsApiOnline(source === "api");
        setNotice({ type: "success", message: `Đã thêm danh mục "${category.name}".` });
      }
      setIsCategoryModalOpen(false);
    } catch {
      setFormError("Không thể lưu danh mục. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= HANDLERS ĐƠN ĐẶT SÁCH, ĐỘC GIẢ, MÃ GIẢM GIÁ =================
  const handleCreateOrder = async (payload: {
    studentName: string;
    email: string;
    phone: string;
    shippingAddress?: string;
    courseId: string;
    courseName: string;
    items?: IOrderItem[];
    subtotal?: number;
    totalNumeric?: number;
    amount: string;
    voucherCode?: string;
    status?: OrderStatus;
  }) => {
    const { order, source } = await createOrder(payload);
    setOrders((prev) => [order, ...prev]);
    setIsApiOnline(source === "api");
    const freshProducts = await getAllProducts();
    setProducts(freshProducts);
    mutateSwrCache(SWR_KEYS.PRODUCTS);
    setNotice({
      type: "success",
      message: `Đã tạo đơn đặt sách cho "${order.studentName}".`,
    });
  };

  const handleChangeOrderStatus = async (orderId: string, status: OrderStatus) => {
    const { order, source } = await updateOrder(orderId, { status });
    setOrders((prev) => prev.map((o) => (o.id === orderId ? order : o)));
    setIsApiOnline(source === "api");
    if (status === "cancelled") {
      const freshProducts = await getAllProducts();
      setProducts(freshProducts);
      mutateSwrCache(SWR_KEYS.PRODUCTS);
    }
    setNotice({
      type: "success",
      message:
        status === "approved"
          ? `Đã xác nhận đóng gói & giao sách cho "${order.studentName}".`
          : `Đã hủy đơn của "${order.studentName}" và hoàn trả tồn kho sách.`,
    });
  };

  const handleCreateUser = async (payload: {
    username: string;
    email: string;
    fullName: string;
    phone?: string;
    password?: string;
    role: string;
  }) => {
    const { user, source } = await createUserAccount(payload);
    setUsers((prev) => [user, ...prev]);
    setIsApiOnline(source === "api");
    setNotice({ type: "success", message: `Đã tạo tài khoản "@${user.username}".` });
  };

  const handleUpdateUser = async (id: string | number, payload: Partial<IUser>) => {
    const { user, source } = await updateUserAccount(id, payload);
    setUsers((prev) =>
      prev.map((u) => (String(u.id ?? u.username) === String(id) ? user : u))
    );
    setIsApiOnline(source === "api");
    setNotice({ type: "success", message: `Đã cập nhật tài khoản "@${user.username}".` });
  };

  const handleCreateVoucher = async (payload: Omit<IVoucher, "id">) => {
    const { voucher, source } = await createVoucher(payload);
    setVouchers((prev) => [voucher, ...prev]);
    setIsApiOnline(source === "api");
    mutateSwrCache(SWR_KEYS.VOUCHERS);
    setNotice({ type: "success", message: `Đã thêm mã ưu đãi "${voucher.code}".` });
  };

  const handleUpdateVoucher = async (id: string, payload: Partial<IVoucher>) => {
    const { voucher, source } = await updateVoucher(id, payload);
    setVouchers((prev) => prev.map((v) => (v.id === id ? voucher : v)));
    setIsApiOnline(source === "api");
    mutateSwrCache(SWR_KEYS.VOUCHERS);
    setNotice({ type: "success", message: `Đã cập nhật mã ưu đãi "${voucher.code}".` });
  };

  // [YÊU CẦU CÔ - CRUD Xóa bản ghi (DELETE REST API trên cả 5 bảng MongoDB)]
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);

    try {
      if (deleteTarget.type === "products") {
        const { source } = await deleteProduct(deleteTarget.id);
        setProducts((prev) => prev.filter((p) => String(p.id) !== String(deleteTarget.id)));
        setIsApiOnline(source === "api");
        mutateSwrCache(SWR_KEYS.PRODUCTS);
      } else if (deleteTarget.type === "categories") {
        const { source } = await deleteCategory(deleteTarget.id);
        setCategories((prev) => prev.filter((c) => String(c.id) !== String(deleteTarget.id)));
        setIsApiOnline(source === "api");
      } else if (deleteTarget.type === "orders") {
        const { source } = await deleteOrder(String(deleteTarget.id));
        setOrders((prev) => prev.filter((o) => String(o.id) !== String(deleteTarget.id)));
        setIsApiOnline(source === "api");
        const freshProducts = await getAllProducts();
        setProducts(freshProducts);
        mutateSwrCache(SWR_KEYS.PRODUCTS);
      } else if (deleteTarget.type === "users") {
        const { source } = await deleteUserAccount(deleteTarget.id);
        setUsers((prev) =>
          prev.filter((u) => String(u.id ?? u.username) !== String(deleteTarget.id))
        );
        setIsApiOnline(source === "api");
      } else if (deleteTarget.type === "vouchers") {
        const { source } = await deleteVoucher(String(deleteTarget.id));
        setVouchers((prev) => prev.filter((v) => String(v.id) !== String(deleteTarget.id)));
        setIsApiOnline(source === "api");
        mutateSwrCache(SWR_KEYS.VOUCHERS);
      }

      setNotice({
        type: "success",
        message: `Đã xóa "${deleteTarget.name}" khỏi hệ thống.`,
      });
      setDeleteTarget(null);
    } catch {
      setNotice({ type: "error", message: "Xóa không thành công. Vui lòng thử lại." });
    } finally {
      setSubmitting(false);
    }
  };

  const sectionHeadingMap: Record<AdminSectionId, string> = {
    overview: "Tổng quan hiệu sách",
    orders: "Đơn đặt sách & giao hàng",
    products: "Quản lý đầu sách & tồn kho",
    categories: "Quản lý tủ sách chuyên đề",
    users: "Độc giả & phân quyền",
    vouchers: "Mã giảm giá mua sách",
  };

  const renderSidebarLinks = () => (
    <>
      {/* Nhóm đầu không nhãn: Tổng quan & Đơn đặt sách */}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => navigateSection("overview")}
          className={`flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-sm transition-colors cursor-pointer ${
            activeSection === "overview"
              ? "bg-amber-50 font-semibold text-amber-800"
              : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
          }`}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <span className="truncate">Tổng quan</span>
        </button>

        <button
          type="button"
          onClick={() => navigateSection("orders")}
          className={`flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-sm transition-colors cursor-pointer ${
            activeSection === "orders"
              ? "bg-amber-50 font-semibold text-amber-800"
              : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
          }`}
        >
          <ClipboardList className="w-4 h-4 shrink-0" />
          <span className="truncate">Đơn đặt sách</span>
          {pendingOrdersCount > 0 ? (
            <span className="ml-auto shrink-0 text-xs font-bold font-tabular text-amber-700">
              {pendingOrdersCount}
            </span>
          ) : (
            <span className="ml-auto shrink-0 text-xs font-tabular text-stone-400">
              {orders.length}
            </span>
          )}
        </button>
      </div>

      {/* Nhóm 2: KHO SÁCH */}
      <div className="mt-5">
        <div className="px-3 mb-1.5 text-xs font-medium uppercase tracking-wide text-stone-400">
          Kho sách &amp; Ưu đãi
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => navigateSection("products")}
            className={`flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-sm transition-colors cursor-pointer ${
              activeSection === "products"
                ? "bg-amber-50 font-semibold text-amber-800"
                : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className="truncate">Đầu sách &amp; Tồn kho</span>
            <span
              className={`ml-auto shrink-0 text-xs font-tabular ${
                activeSection === "products" ? "text-amber-800 font-semibold" : "text-stone-400"
              }`}
            >
              {products.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigateSection("categories")}
            className={`flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-sm transition-colors cursor-pointer ${
              activeSection === "categories"
                ? "bg-amber-50 font-semibold text-amber-800"
                : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            <FolderKanban className="w-4 h-4 shrink-0" />
            <span className="truncate">Tủ chuyên đề</span>
            <span
              className={`ml-auto shrink-0 text-xs font-tabular ${
                activeSection === "categories"
                  ? "text-amber-800 font-semibold"
                  : "text-stone-400"
              }`}
            >
              {categories.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigateSection("vouchers")}
            className={`flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-sm transition-colors cursor-pointer ${
              activeSection === "vouchers"
                ? "bg-amber-50 font-semibold text-amber-800"
                : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            <Ticket className="w-4 h-4 shrink-0" />
            <span className="truncate">Mã giảm giá</span>
            <span
              className={`ml-auto shrink-0 text-xs font-tabular ${
                activeSection === "vouchers" ? "text-amber-800 font-semibold" : "text-stone-400"
              }`}
            >
              {vouchers.length}
            </span>
          </button>
        </div>
      </div>

      {/* Nhóm 3: HỆ THỐNG */}
      <div className="mt-5">
        <div className="px-3 mb-1.5 text-xs font-medium uppercase tracking-wide text-stone-400">
          Hệ thống
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => navigateSection("users")}
            className={`flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-sm transition-colors cursor-pointer ${
              activeSection === "users"
                ? "bg-amber-50 font-semibold text-amber-800"
                : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className="truncate">Độc giả &amp; Quản trị</span>
            <span
              className={`ml-auto shrink-0 text-xs font-tabular ${
                activeSection === "users" ? "text-amber-800 font-semibold" : "text-stone-400"
              }`}
            >
              {users.length}
            </span>
          </button>

          <Link
            href="/"
            className="flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-sm text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">Xem kệ sách 3D</span>
          </Link>
        </div>
      </div>
    </>
  );

  // ================= KHUNG APP DASHBOARD RIÊNG BIỆT =================
  return (
    <div className="min-h-screen flex bg-[#FAFAF9] text-[#0F172A]">
      {/* 1. SIDEBAR TRẮNG CỐ ĐỊNH TRÊN DESKTOP */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-white sticky top-0 h-screen">
        <div className="h-14 px-4 border-b border-stone-200 flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-amber-700 text-white flex items-center justify-center font-hanzi text-base font-black shrink-0">
            字
          </div>
          <div className="min-w-0">
            <div className="text-sm font-black text-stone-900 tracking-tight truncate">
              HANZI ADMIN
            </div>
          </div>
        </div>

        <nav aria-label="Điều hướng quản trị" className="flex-1 px-3 py-4 flex flex-col overflow-y-auto">
          {renderSidebarLinks()}
        </nav>

        <div className="p-3 shrink-0">
          <div className="flex items-center justify-between gap-2 rounded-xl bg-stone-50 border border-stone-200 p-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center text-xs font-black shrink-0">
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-stone-900 truncate">
                  {currentUser.username}
                </div>
                <div className="text-[11px] text-amber-700 font-semibold truncate">
                  Quản trị viên
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAdminLogout}
              aria-label="Đăng xuất khỏi trang quản trị"
              title="Đăng xuất"
              className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      {/* PANEL MENU TRƯỢT TỪ TRÁI TRÊN DI ĐỘNG (< LG, CHUẨN SHELL.MD) */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/15"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileMenuOpen(false);
          }}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu điều hướng quản trị"
            className="w-64 max-w-[calc(100vw-56px)] h-full bg-white shadow-2xl flex flex-col"
          >
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="sr-only"
            >
              Đóng menu điều hướng
            </button>

            <div className="h-14 px-4 border-b border-stone-200 flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-hanzi text-base font-black shrink-0">
                字
              </div>
              <div className="text-sm font-black text-stone-900 tracking-tight truncate">
                HANZI ADMIN
              </div>
            </div>

            <nav className="flex-1 px-3 py-4 flex flex-col overflow-y-auto">
              {renderSidebarLinks()}
            </nav>

            <div className="p-3 shrink-0">
              <div className="flex items-center justify-between gap-2 rounded-xl bg-stone-50 border border-stone-200 p-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center text-xs font-black shrink-0">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-stone-900 truncate">
                      {currentUser.username}
                    </div>
                    <div className="text-[11px] text-amber-700 font-semibold truncate">
                      Quản trị viên
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAdminLogout}
                  aria-label="Đăng xuất"
                  className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* 2. CỘT NỘI DUNG BÊN PHẢI */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 px-4 sm:px-6 bg-white border-b border-stone-200 flex items-center justify-between gap-3 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Mở menu quản trị"
              className="lg:hidden p-2 -ml-1.5 rounded-xl text-stone-600 hover:bg-stone-100 cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
            <h1 className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight truncate">
              {sectionHeadingMap[activeSection]}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                isApiOnline || isSwrOnline
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-amber-50 text-amber-900 border-amber-200"
              }`}
            >
              <Database className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>
                {isApiOnline || isSwrOnline
                  ? "MongoDB đang kết nối (:3001)"
                  : "Chưa kết nối Backend MongoDB (:3001)"}
              </span>
            </div>

            <button
              type="button"
              onClick={fetchAllData}
              disabled={loading}
              aria-label="Làm mới dữ liệu"
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Làm mới</span>
            </button>

            {(activeSection === "overview" || activeSection === "products") && (
              <button
                type="button"
                onClick={openCreateProductModal}
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 h-9 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span className="sm:hidden">Thêm</span>
                <span className="hidden sm:inline">Thêm đầu sách</span>
              </button>
            )}

            {activeSection === "categories" && (
              <button
                type="button"
                onClick={openCreateCategoryModal}
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 h-9 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span className="sm:hidden">Thêm</span>
                <span className="hidden sm:inline">Thêm tủ chuyên đề</span>
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 space-y-6 max-w-[1600px] w-full">
          {notice && (
            <div
              role={notice.type === "error" ? "alert" : "status"}
              aria-live="polite"
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold ${
                notice.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border-rose-200 text-rose-700"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {notice.type === "success" ? (
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-600 shrink-0"
                    aria-hidden="true"
                  />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
                )}
                <span className="wrap-anywhere">{notice.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setNotice(null)}
                aria-label="Đóng thông báo"
                className="p-1 rounded-lg hover:bg-black/5 text-current shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {loadError ? (
            <div
              role="alert"
              className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-3"
            >
              <p className="text-sm font-semibold text-rose-700">{loadError}</p>
              <button
                type="button"
                onClick={fetchAllData}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer"
              >
                Thử lại
              </button>
            </div>
          ) : activeSection === "overview" ? (
            <AdminOverview
              products={products}
              categories={categories}
              orders={orders}
              users={users}
              loading={loading}
              onNavigate={navigateSection}
              onQuickApproveOrder={(orderId) => handleChangeOrderStatus(orderId, "approved")}
            />
          ) : activeSection === "orders" ? (
            <AdminOrdersSection
              orders={orders}
              products={products}
              onCreateOrder={handleCreateOrder}
              onChangeStatus={handleChangeOrderStatus}
              onRequestDelete={(ord) =>
                setDeleteTarget({
                  type: "orders",
                  id: ord.id,
                  name: `Đơn ${ord.id} của ${ord.studentName}`,
                })
              }
            />
          ) : activeSection === "users" ? (
            <AdminUsersSection
              users={users}
              currentAdminUsername={currentUser.username}
              onCreateUser={handleCreateUser}
              onUpdateUser={handleUpdateUser}
              onRequestDelete={(u) =>
                setDeleteTarget({
                  type: "users",
                  id: u.id ?? u.username,
                  name: `Tài khoản @${u.username}`,
                })
              }
            />
          ) : activeSection === "vouchers" ? (
            <AdminVouchersSection
              vouchers={vouchers}
              onCreateVoucher={handleCreateVoucher}
              onUpdateVoucher={handleUpdateVoucher}
              onRequestDelete={(v) =>
                setDeleteTarget({
                  type: "vouchers",
                  id: v.id,
                  name: `Mã ưu đãi ${v.code}`,
                })
              }
            />
          ) : activeSection === "products" ? (
            /* ================= QUẢN LÝ ĐẦU SÁCH ================= */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="sm:w-72">
                  <label htmlFor="admin-search-products" className="sr-only">
                    Tìm đầu sách
                  </label>
                  <input
                    id="admin-search-products"
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm theo tên hoặc mã đầu sách..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label htmlFor="admin-category-filter" className="sr-only">
                    Lọc theo danh mục
                  </label>
                  <select
                    id="admin-category-filter"
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="all">Danh mục: Tất cả ({products.length})</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                {loading ? (
                  <div role="status" aria-busy="true" className="p-5 space-y-3">
                    {[1, 2, 3, 4].map((r) => (
                      <div key={r} className="h-12 rounded-xl bg-stone-100 animate-pulse" />
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="py-10 px-4 text-center space-y-2">
                    <p className="text-sm text-stone-500">
                      Không tìm thấy đầu sách nào khớp với điều kiện lọc.
                    </p>
                    {(searchTerm || selectedCategoryFilter !== "all") && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategoryFilter("all");
                        }}
                        className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
                      >
                        Xóa tìm kiếm & bộ lọc
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-500">
                            <th scope="col" className="py-3 px-4">
                              Đầu sách &amp; Tác giả
                            </th>
                            <th scope="col" className="py-3 px-4 whitespace-nowrap">
                              Tủ chuyên đề
                            </th>
                            <th
                              scope="col"
                              className="py-3 px-4 whitespace-nowrap hidden 2xl:table-cell"
                            >
                              Số trang
                            </th>
                            <th scope="col" className="py-3 px-4 text-right whitespace-nowrap">
                              Giá bìa mềm
                            </th>
                            <th
                              scope="col"
                              className="py-3 px-4 text-right whitespace-nowrap"
                            >
                              Tồn kho
                            </th>
                            <th scope="col" className="py-3 px-4 text-right whitespace-nowrap w-28">
                              <span className="sr-only">Thao tác</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 text-sm">
                          {filteredProducts.map((prod) => {
                            const softStock = prod.editions?.paperback?.stock ?? 20;
                            const hardStock = prod.editions?.hardcover?.stock ?? 8;
                            return (
                              <tr
                                key={prod.id}
                                className="hover:bg-stone-50/90 transition-colors"
                              >
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <img
                                      src={prod.image || "/images/book-covers/hsk-1.jpg"}
                                      alt={prod.name}
                                      width={40}
                                      height={60}
                                      className="w-10 h-14 rounded object-cover border border-stone-200 shrink-0 bg-stone-100"
                                    />
                                    <div className="min-w-0 max-w-[230px] xl:max-w-[280px] 2xl:max-w-md">
                                      <div className="flex items-center gap-2">
                                        <span
                                          className="font-bold text-stone-900 truncate"
                                          title={prod.name}
                                        >
                                          {prod.name}
                                        </span>
                                        {prod.badge && (
                                          <span className="hidden xl:inline-block px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-bold shrink-0">
                                            {prod.badge}
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-xs text-stone-500 truncate">
                                        {prod.author || "Ban Biên Tập HANZI"} · Mã:{" "}
                                        <span className="font-mono">{String(prod.id)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 whitespace-nowrap">
                                  <span className="inline-block max-w-[170px] truncate px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-semibold align-middle">
                                    {getCategoryLabel(prod.categoryId)}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-xs text-stone-600 whitespace-nowrap hidden 2xl:table-cell font-tabular">
                                  {prod.pages ? `${prod.pages} trang` : prod.duration || "—"}
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap font-tabular">
                                  <div className="font-bold text-stone-900">{prod.price}</div>
                                  {prod.originalPrice && (
                                    <div className="text-xs text-stone-400 line-through">
                                      {prod.originalPrice}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-right text-xs text-stone-700 whitespace-nowrap font-tabular">
                                  <span className="font-semibold">{softStock}</span> mềm ·{" "}
                                  <span className="font-semibold text-amber-800">{hardStock}</span>{" "}
                                  cứng
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  <div className="inline-flex items-center justify-end gap-1">
                                    <Link
                                      href={`/detail/${prod.id}`}
                                      aria-label={`Xem trang chi tiết ${prod.name}`}
                                      title="Xem ngoài kệ sách"
                                      className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
                                    >
                                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                                    </Link>
                                    <button
                                      type="button"
                                      onClick={() => openEditProductModal(prod)}
                                      aria-label={`Chỉnh sửa ${prod.name}`}
                                      className="p-2 rounded-lg text-stone-600 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                                    >
                                      <Pencil className="w-4 h-4" aria-hidden="true" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setDeleteTarget({
                                          type: "products",
                                          id: prod.id,
                                          name: prod.name,
                                        })
                                      }
                                      aria-label={`Xóa ${prod.name}`}
                                      className="p-2 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <ul className="md:hidden divide-y divide-stone-200">
                      {filteredProducts.map((prod) => (
                        <li key={prod.id} className="p-4 space-y-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <img
                              src={prod.image || "/images/courses/hsk-1.jpg"}
                              alt={prod.name}
                              width={56}
                              height={42}
                              className="w-14 h-11 rounded-lg object-cover border border-stone-200 shrink-0 bg-stone-100"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-stone-900 line-clamp-2 text-pretty">
                                {prod.name}
                              </p>
                              <p className="text-xs text-stone-500 truncate mt-0.5">
                                {getCategoryLabel(prod.categoryId)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2 pt-1">
                            <span className="text-sm font-black text-amber-700 font-tabular">
                              {prod.price}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openEditProductModal(prod)}
                                aria-label={`Chỉnh sửa ${prod.name}`}
                                className="px-3 min-h-10 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-stone-800 cursor-pointer"
                              >
                                Sửa
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteTarget({
                                    type: "products",
                                    id: prod.id,
                                    name: prod.name,
                                  })
                                }
                                aria-label={`Xóa ${prod.name}`}
                                className="px-3 min-h-10 rounded-xl border border-rose-200 bg-rose-50/70 text-xs font-bold text-rose-700 cursor-pointer"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 text-xs text-stone-500">
                      Đang hiển thị{" "}
                      <strong className="text-stone-800 font-tabular">
                        {filteredProducts.length}
                      </strong>{" "}
                      trong tổng số{" "}
                      <strong className="text-stone-800 font-tabular">{products.length}</strong>{" "}
                      đầu sách
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* ================= QUẢN LÝ DANH MỤC ================= */
            <div className="space-y-4">
              <div className="sm:w-72">
                <label htmlFor="admin-search-categories" className="sr-only">
                  Tìm danh mục
                </label>
                <input
                  id="admin-search-categories"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo tên hoặc slug danh mục..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                {filteredCategories.length === 0 ? (
                  <div className="py-10 px-4 text-center space-y-2">
                    <p className="text-sm text-stone-500">
                      Không tìm thấy danh mục nào khớp với từ khóa.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="hidden md:block">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-500">
                            <th scope="col" className="py-3 px-4">
                              Tủ sách chuyên đề
                            </th>
                            <th scope="col" className="py-3 px-4 whitespace-nowrap">
                              Slug đường dẫn
                            </th>
                            <th scope="col" className="py-3 px-4 whitespace-nowrap">
                              Nhãn
                            </th>
                            <th scope="col" className="py-3 px-4 text-right whitespace-nowrap">
                              Số đầu sách
                            </th>
                            <th
                              scope="col"
                              className="py-3 px-4 text-right whitespace-nowrap w-28"
                            >
                              <span className="sr-only">Thao tác</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 text-sm">
                          {filteredCategories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-stone-50/90 transition-colors">
                              <td className="py-3 px-4 max-w-md">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ backgroundColor: cat.color || "#D97706" }}
                                    aria-hidden="true"
                                  />
                                  <div className="min-w-0">
                                    <div
                                      className="font-bold text-stone-900 truncate"
                                      title={cat.name}
                                    >
                                      {cat.name}
                                    </div>
                                    <div
                                      className="text-xs text-stone-500 truncate"
                                      title={cat.description}
                                    >
                                      {cat.description}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-xs font-mono text-stone-600 whitespace-nowrap">
                                {cat.slug}
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                {cat.badge ? (
                                  <span className="inline-flex px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">
                                    {cat.badge}
                                  </span>
                                ) : (
                                  <span className="text-stone-400">—</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right font-bold text-stone-800 font-tabular whitespace-nowrap">
                                {cat.count ?? 0}
                              </td>
                              <td className="py-3 px-4 text-right whitespace-nowrap">
                                <div className="inline-flex items-center justify-end gap-1">
                                  <button
                                    type="button"
                                    onClick={() => openEditCategoryModal(cat)}
                                    aria-label={`Chỉnh sửa danh mục ${cat.name}`}
                                    className="p-2 rounded-lg text-stone-600 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                                  >
                                    <Pencil className="w-4 h-4" aria-hidden="true" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDeleteTarget({
                                        type: "categories",
                                        id: cat.id,
                                        name: cat.name,
                                      })
                                    }
                                    aria-label={`Xóa danh mục ${cat.name}`}
                                    className="p-2 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <ul className="md:hidden divide-y divide-stone-200">
                      {filteredCategories.map((cat) => (
                        <li key={cat.id} className="p-4 space-y-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-stone-900">{cat.name}</p>
                              <p className="text-xs text-stone-500 line-clamp-2 mt-0.5">
                                {cat.description}
                              </p>
                            </div>
                            {cat.badge && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-bold shrink-0">
                                {cat.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs text-stone-500 font-tabular">
                              Số đầu sách: <strong className="text-stone-800">{cat.count ?? 0}</strong>
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openEditCategoryModal(cat)}
                                className="px-3 min-h-10 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-stone-800 cursor-pointer"
                              >
                                Sửa
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteTarget({
                                    type: "categories",
                                    id: cat.id,
                                    name: cat.name,
                                  })
                                }
                                className="px-3 min-h-10 rounded-xl border border-rose-200 bg-rose-50/70 text-xs font-bold text-rose-700 cursor-pointer"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL THÊM / SỬA KHÓA HỌC ================= */}
      {isProductModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-[1px] flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget && !submitting) setIsProductModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            className="w-full max-w-2xl bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden my-auto"
          >
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h2
                id="product-modal-title"
                className="text-base sm:text-lg font-black text-stone-900"
              >
                {editingProductId !== null ? "Chỉnh Sửa Đầu Sách" : "Thêm Đầu Sách Mới"}
              </h2>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                disabled={submitting}
                aria-label="Đóng hộp thoại"
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <form
              noValidate
              onSubmit={handleSaveProduct}
              className="p-5 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              {formError && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700"
                >
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label htmlFor="prod-name" className="block text-xs font-bold text-stone-700">
                    Tên đầu sách <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="prod-name"
                    name="name"
                    type="text"
                    aria-invalid={Boolean(productFieldErrors.name)}
                    value={productForm.name}
                    onChange={handleProductInputChange}
                    placeholder="Ví dụ: Giáo Trình Chuẩn HSK 5 — Quyển Thượng"
                    className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      productFieldErrors.name ? "border-red-400 bg-red-50/40" : "border-stone-300"
                    }`}
                  />
                  {productFieldErrors.name && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {productFieldErrors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="prod-id" className="block text-xs font-bold text-stone-700">
                    Mã sách (ID)
                  </label>
                  <input
                    id="prod-id"
                    name="id"
                    type="text"
                    disabled={editingProductId !== null}
                    value={productForm.id}
                    onChange={handleProductInputChange}
                    placeholder="Tự tạo nếu để trống"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 disabled:bg-stone-100 disabled:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label htmlFor="prod-category" className="block text-xs font-bold text-stone-700">
                    Tủ chuyên đề <span className="text-rose-600">*</span>
                  </label>
                  <select
                    id="prod-category"
                    name="categoryId"
                    value={productForm.categoryId}
                    onChange={handleProductInputChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="prod-price" className="block text-xs font-bold text-stone-700">
                    Giá bìa mềm <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="prod-price"
                    name="price"
                    type="text"
                    aria-invalid={Boolean(productFieldErrors.price)}
                    value={productForm.price}
                    onChange={handleProductInputChange}
                    placeholder="Ví dụ: 169.000₫"
                    className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm text-stone-900 font-tabular focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      productFieldErrors.price ? "border-red-400 bg-red-50/40" : "border-stone-300"
                    }`}
                  />
                  {productFieldErrors.price && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {productFieldErrors.price}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="prod-original-price"
                    className="block text-xs font-bold text-stone-700"
                  >
                    Giá niêm yết gốc
                  </label>
                  <input
                    id="prod-original-price"
                    name="originalPrice"
                    type="text"
                    value={productForm.originalPrice}
                    onChange={handleProductInputChange}
                    placeholder="Ví dụ: 210.000₫"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 font-tabular focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label htmlFor="prod-author" className="block text-xs font-bold text-stone-700">
                    Tác giả / Chủ biên
                  </label>
                  <input
                    id="prod-author"
                    name="author"
                    type="text"
                    value={productForm.author}
                    onChange={handleProductInputChange}
                    placeholder="GS. Khương Lệ Bình"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="prod-pages" className="block text-xs font-bold text-stone-700">
                    Số trang in
                  </label>
                  <input
                    id="prod-pages"
                    name="pages"
                    type="number"
                    min={16}
                    aria-invalid={Boolean(productFieldErrors.pages)}
                    value={productForm.pages}
                    onChange={handleProductInputChange}
                    placeholder="260"
                    className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm text-stone-900 font-tabular focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      productFieldErrors.pages ? "border-red-400 bg-red-50/40" : "border-stone-300"
                    }`}
                  />
                  {productFieldErrors.pages && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {productFieldErrors.pages}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="prod-badge" className="block text-xs font-bold text-stone-700">
                    Nhãn trên bìa
                  </label>
                  <input
                    id="prod-badge"
                    name="badge"
                    type="text"
                    value={productForm.badge}
                    onChange={handleProductInputChange}
                    placeholder="Bán Chạy / Bìa Cứng"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="prod-image" className="block text-xs font-bold text-stone-700">
                  Đường dẫn ảnh bìa sách cứng (tỉ lệ 2:3)
                </label>
                <input
                  id="prod-image"
                  name="image"
                  type="text"
                  value={productForm.image}
                  onChange={handleProductInputChange}
                  placeholder="/images/book-covers/hsk-1.jpg"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-stone-500 mr-1">Chọn nhanh:</span>
                  {PRESET_COURSE_IMAGES.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() =>
                        setProductForm((prev) => ({ ...prev, image: preset.url }))
                      }
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition-colors ${
                        productForm.image === preset.url
                          ? "bg-amber-100 border-amber-400 text-amber-900"
                          : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="prod-desc" className="block text-xs font-bold text-stone-700">
                  Mô tả tóm tắt <span className="text-rose-600">*</span>
                </label>
                <textarea
                  id="prod-desc"
                  name="desc"
                  rows={2}
                  aria-invalid={Boolean(productFieldErrors.desc)}
                  value={productForm.desc}
                  onChange={handleProductInputChange}
                  placeholder="Tóm tắt nội dung cốt lõi của ấn phẩm..."
                  className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    productFieldErrors.desc ? "border-red-400 bg-red-50/40" : "border-stone-300"
                  }`}
                />
                {/* [YÊU CẦU CÔ - Validation] Lỗi inline mô tả đầu sách */}
                {productFieldErrors.desc && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {productFieldErrors.desc}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="prod-features" className="block text-xs font-bold text-stone-700">
                  Điểm nổi bật của ấn phẩm (mỗi dòng 1 ý)
                </label>
                <textarea
                  id="prod-features"
                  name="featuresText"
                  rows={3}
                  value={productForm.featuresText}
                  onChange={handleProductInputChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-xs sm:text-sm font-bold text-stone-700 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold cursor-pointer disabled:opacity-50"
                >
                  {submitting
                    ? "Đang lưu..."
                    : editingProductId !== null
                    ? "Lưu cập nhật"
                    : "Thêm đầu sách"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL THÊM / SỬA DANH MỤC ================= */}
      {isCategoryModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-[1px] flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget && !submitting) setIsCategoryModalOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-modal-title"
            className="w-full max-w-lg bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden my-auto"
          >
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h2
                id="category-modal-title"
                className="text-base sm:text-lg font-black text-stone-900"
              >
                {editingCategoryId !== null ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục Mới"}
              </h2>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                disabled={submitting}
                aria-label="Đóng hộp thoại"
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <form noValidate onSubmit={handleSaveCategory} className="p-5 space-y-4">
              {formError && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700"
                >
                  {formError}
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="cat-name" className="block text-xs font-bold text-stone-700">
                  Tên danh mục <span className="text-rose-600">*</span>
                </label>
                <input
                  id="cat-name"
                  name="name"
                  type="text"
                  aria-invalid={Boolean(categoryFieldErrors.name)}
                  value={categoryForm.name}
                  onChange={handleCategoryInputChange}
                  placeholder="Ví dụ: Luyện Dịch Tiếng Trung Biên Phiên Dịch"
                  className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    categoryFieldErrors.name ? "border-red-400 bg-red-50/40" : "border-stone-300"
                  }`}
                />
                {/* [YÊU CẦU CÔ - Validation] Lỗi inline tên danh mục */}
                {categoryFieldErrors.name && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {categoryFieldErrors.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="cat-slug" className="block text-xs font-bold text-stone-700">
                    Đường dẫn (slug)
                  </label>
                  <input
                    id="cat-slug"
                    name="slug"
                    type="text"
                    value={categoryForm.slug}
                    onChange={handleCategoryInputChange}
                    placeholder="Tự sinh nếu để trống"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="cat-badge" className="block text-xs font-bold text-stone-700">
                    Nhãn phân loại
                  </label>
                  <input
                    id="cat-badge"
                    name="badge"
                    type="text"
                    value={categoryForm.badge}
                    onChange={handleCategoryInputChange}
                    placeholder="Ví dụ: Chuyên sâu"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="cat-count" className="block text-xs font-bold text-stone-700">
                    Số đầu sách
                  </label>
                  <input
                    id="cat-count"
                    name="count"
                    type="number"
                    min={0}
                    value={categoryForm.count}
                    onChange={handleCategoryInputChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 font-tabular focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="cat-color" className="block text-xs font-bold text-stone-700">
                    Mã màu đại diện
                  </label>
                  <input
                    id="cat-color"
                    name="color"
                    type="text"
                    aria-invalid={Boolean(categoryFieldErrors.color)}
                    value={categoryForm.color}
                    onChange={handleCategoryInputChange}
                    placeholder="#D97706"
                    className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      categoryFieldErrors.color ? "border-red-400 bg-red-50/40" : "border-stone-300"
                    }`}
                  />
                  {/* [YÊU CẦU CÔ - Validation] Lỗi inline mã màu */}
                  {categoryFieldErrors.color && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {categoryFieldErrors.color}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="cat-desc" className="block text-xs font-bold text-stone-700">
                  Mô tả danh mục <span className="text-rose-600">*</span>
                </label>
                <textarea
                  id="cat-desc"
                  name="description"
                  rows={3}
                  aria-invalid={Boolean(categoryFieldErrors.description)}
                  value={categoryForm.description}
                  onChange={handleCategoryInputChange}
                  placeholder="Giới thiệu ngắn gọn nhóm ấn phẩm trong tủ chuyên đề..."
                  className={`w-full px-3.5 py-2 rounded-xl bg-white border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    categoryFieldErrors.description
                      ? "border-red-400 bg-red-50/40"
                      : "border-stone-300"
                  }`}
                />
                {/* [YÊU CẦU CÔ - Validation] Lỗi inline mô tả danh mục */}
                {categoryFieldErrors.description && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {categoryFieldErrors.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-xs sm:text-sm font-bold text-stone-700 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold cursor-pointer disabled:opacity-50"
                >
                  {submitting
                    ? "Đang lưu..."
                    : editingCategoryId !== null
                    ? "Lưu cập nhật"
                    : "Tạo danh mục"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL XÁC NHẬN XÓA CHUNG ================= */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-[1px] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !submitting) setDeleteTarget(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="w-full max-w-md bg-white rounded-2xl border border-stone-200 shadow-2xl p-6 space-y-4"
          >
            <div className="space-y-1.5">
              <h2 id="delete-modal-title" className="text-base font-black text-stone-900">
                Xác nhận xóa bản ghi?
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Bạn sắp xóa vĩnh viễn{" "}
                <strong className="text-stone-900">"{deleteTarget.name}"</strong> khỏi hệ thống.
                Thao tác này không thể hoàn tác.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={submitting}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-xs sm:text-sm font-bold text-stone-700 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={submitting}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Đang xóa..." : "Xóa vĩnh viễn"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
