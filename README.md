# HANZI — Nhà Sách & Học Liệu Tiếng Trung (React/Next.js + Node.js/Express + MongoDB)

Dự án được phân chia rõ ràng thành 2 thư mục độc lập:

- **`frontend/`**: Giao diện Hiệu sách 3D & trang Quản trị Admin viết bằng **React 19 / Next.js 16 + TypeScript + Tailwind CSS + Redux Toolkit + SWR** (chạy tại `http://localhost:3003`).
- **`backend/`**: Máy chủ REST API viết bằng **Node.js + Express 5 + Mongoose**, kết nối trực tiếp cơ sở dữ liệu **MongoDB** (`mongodb://127.0.0.1:27017/hanzi_master`, chạy tại `http://localhost:3001/api`), có sẵn chế độ dự phòng bộ nhớ khi triển khai trên cloud chưa cấu hình `MONGODB_URI`.

> **Mẹo khi bảo vệ ASM trước Cô:** Trong VS Code, bấm **`Ctrl + Shift + F`** và gõ từ khóa **`[YÊU CẦU CÔ`** để nhảy tới đúng từng dòng code đã gắn chú thích theo yêu cầu môn học!

---

## Cấu trúc thư mục

```text
wd21201/
├── backend/                     # Backend Node.js + Express 5 + MongoDB
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js            # Kết nối Mongoose tới MongoDB (hanzi_master / Atlas)
│   │   │   └── memoryStore.js   # Dự phòng dữ liệu bộ nhớ khi chạy cloud không có MONGODB_URI
│   │   ├── models/              # 7 Mongoose Models (Category, Product, User, Order, Voucher, Plan, HskCourse)
│   │   ├── controllers/         # Xử lý CRUD + Đăng ký/Đăng nhập + Cố vấn Sách AI
│   │   ├── routes/index.js      # Định tuyến 28 REST API (/api/...)
│   │   ├── seed/                # 30 đầu sách, 6 tủ chuyên đề, 6 bộ Boxset & script nạp vào MongoDB
│   │   └── server.js            # Khởi chạy Express Server cổng 3001
│   ├── .env                     # Biến môi trường Backend (PORT, MONGODB_URI, GEMINI_API_KEY)
│   └── package.json
│
├── frontend/                    # Frontend React 19 / Next.js 16
│   ├── src/
│   │   ├── app/                 # Các trang (/, /products, /category, /detail, /detail/[id], /checkout, /about, /login, /register, /admin)
│   │   ├── components/
│   │   │   ├── vankho/          # Giao diện Hiệu sách 3D (VanKhoExperience, HeaderFooterShell, CoverFlowHero, Lookbook, Catalog, Drawers)
│   │   │   ├── checkout/        # Trang Thanh toán riêng biệt 2 cột (CheckoutPageClient.tsx)
│   │   │   ├── admin/           # Admin Dashboard 6 phân hệ CRUD (Tổng quan, Đơn sách, Đầu sách, Tủ chuyên đề, Voucher, Tài khoản)
│   │   │   ├── ai/              # Hộp thoại Cố vấn Sách AI & Từ điển Hán ngữ (AITutorChatBox.tsx)
│   │   │   └── *.tsx            # Thẻ sách & Form (WolfProductCard, CategoryCard, ProductCard, ProductDetailCard, LoginForm, RegisterForm)
│   │   ├── context/             # Context API (AiTutorContext.tsx: createContext + useContext)
│   │   ├── hooks/               # Custom Hooks + useSWR (useSwrApi.ts)
│   │   ├── store/               # Redux Toolkit (configureStore, authSlice, voucherWalletSlice, cartSlice, AppProviders)
│   │   ├── interfaces/          # Khai báo kiểu TypeScript (IProduct, ICategory, IUser, IOrder, IVoucher)
│   │   ├── lib/                 # Validation thuần TS (validation.ts), cấu hình API (api-url.ts), Audio (audio.ts)
│   │   └── services/            # Gọi 28 REST API Backend qua fetch + try...catch
│   ├── public/                  # Hình ảnh 30 bìa sách & tài nguyên tĩnh
│   ├── .env.local               # NEXT_PUBLIC_API_URL=http://localhost:3001/api
│   └── package.json
│
├── start-render.mjs             # Script khởi chạy đồng thời Backend + Frontend khi deploy Render
└── package.json                 # Scripts dev / build / start / lint / seed toàn dự án
```

---

## Bảng tra cứu nhanh các yêu cầu chấm bài của Cô

| Hạng mục yêu cầu | Nơi triển khai đang chạy thực tế trong code (có gắn comment `[YÊU CẦU CÔ - ...]`) |
| :--- | :--- |
| **Lab 1: Tạo Project & Bố cục gốc** | `frontend/src/app/layout.tsx`, `frontend/src/app/page.tsx`, `backend/src/server.js` |
| **Lab 2: Tạo Component tái sử dụng** | `frontend/src/components/vankho/VanKhoHeaderFooterShell.tsx`, `frontend/src/components/WolfProductCard.tsx`, `frontend/src/components/CategoryCard.tsx`, `frontend/src/components/ProductCard.tsx` |
| **Lab 3: Component + Props (Cha → Con)** | `page.tsx` → `VanKhoExperience.tsx` → `VanKhoCoverFlowHero.tsx` / `VanKhoLookbook.tsx` / `VanKhoCatalogSection.tsx`; `products/page.tsx` → `WolfProductCard.tsx`; `detail/[id]/page.tsx` → `ProductDetailCard.tsx`; `AdminDashboard.tsx` → `AdminOverview.tsx` / `AdminOrdersSection.tsx` / `AdminUsersSection.tsx` / `AdminVouchersSection.tsx` |
| **Lab 4: `useState` + Form & Validation JS/TS** | `frontend/src/lib/validation.ts`, `CheckoutPageClient.tsx` (`/checkout`), `LoginForm.tsx`, `RegisterForm.tsx`, `ProductDetailCard.tsx`, `VanKhoHeaderFooterShell.tsx` (Form bản tin), Modal CRUD trong `AdminDashboard.tsx`, `AdminOrdersSection.tsx`, `AdminUsersSection.tsx`, `AdminVouchersSection.tsx` |
| **`useEffect` (Vòng đời & Sự kiện)** | `AppProviders.tsx` (đồng bộ auth/cart/voucher từ `localStorage`), `VanKhoHeaderFooterShell.tsx`, `CheckoutPageClient.tsx`, `AdminDashboard.tsx` (gọi API khi xác nhận Admin & bắt phím `Escape`), `AITutorChatBox.tsx` |
| **`useMemo` (Tối ưu lọc & Biểu đồ)** | `VanKhoCatalogSection.tsx` (lọc & sắp xếp 30 đầu sách), `CheckoutPageClient.tsx` (tính tổng tiền, voucher & phí ship), `AdminOverview.tsx`, `AdminDashboard.tsx`, `AdminOrdersSection.tsx`, `AdminUsersSection.tsx`, `AdminVouchersSection.tsx` |
| **Custom Hooks + `useSWR` (`swr`)** | `frontend/src/hooks/useSwrApi.ts` (`useVouchersSWR`, `useBackendHealthSWR`, `useProductsSWR`), dùng trực tiếp ở `VanKhoExperience.tsx`, `VanKhoHeaderFooterShell.tsx`, `VanKhoDrawers.tsx`, `CheckoutPageClient.tsx`, `ProductDetailCard.tsx` và `AdminDashboard.tsx` (`mutate`) |
| **Context API (`createContext` / `useContext`)** | `frontend/src/context/AiTutorContext.tsx`, dùng ở `VanKhoHeaderFooterShell.tsx` (nút **Cố vấn AI**) và `AITutorChatBox.tsx` |
| **Redux Toolkit (`@reduxjs/toolkit` + `react-redux`)** | `frontend/src/store/index.ts`, `authSlice.ts`, `voucherWalletSlice.ts`, `cartSlice.ts`, `AppProviders.tsx`; dùng ở `VanKhoHeaderFooterShell.tsx`, `VanKhoCoverFlowHero.tsx`, `VanKhoCatalogSection.tsx`, `VanKhoDrawers.tsx`, `CheckoutPageClient.tsx`, `WolfProductCard.tsx`, `ProductDetailCard.tsx`, `LoginForm.tsx`, `AdminDashboard.tsx` |
| **Phân quyền RBAC & CRUD React + REST API Node.js & MongoDB** | 28 API tại `backend/src/routes/index.js` + 7 Mongoose Models + `frontend/src/services/*.service.ts` + trang quản trị 6 phân hệ `frontend/src/components/admin/AdminDashboard.tsx` (chặn 403 tài khoản thường) |

---

## Cách khởi chạy dự án (Localhost)

Đảm bảo dịch vụ **MongoDB** đang bật trên máy (`127.0.0.1:27017`), sau đó mở **2 cửa sổ Terminal** tại `c:\Users\Admin\Desktop\REACT\wd21201`:

1. **Terminal 1 — Chạy Backend (Node.js + MongoDB cổng `3001`):**
   ```bash
   cd backend
   npm run dev
   ```
   *(Lần đầu chạy hoặc khi muốn làm mới dữ liệu gốc trong MongoDB: `npm run seed`)*

2. **Terminal 2 — Chạy Frontend (React/Next.js cổng `3003`):**
   ```bash
   cd frontend
   npm run dev
   ```

- Trang hiệu sách: `http://localhost:3003`
- Trang quản trị Admin: `http://localhost:3003/admin` (Tài khoản mặc định: `admin` / `123`, độc giả mẫu: `student` / `123`)
- Kiểm tra API MongoDB: `http://localhost:3001/api/health`

## Deploy lên Render (1 Web Service duy nhất)

- **Build Command:** `npm install; npm run build`
- **Start Command:** `npm run start`
- **Biến môi trường tùy chọn:** Thêm `MONGODB_URI` (MongoDB Atlas) và `GEMINI_API_KEY` trong mục *Environment* của Render để lưu dữ liệu vĩnh viễn và bật Gemini AI trực tuyến.
