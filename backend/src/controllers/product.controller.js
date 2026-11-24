import { Product } from "../models/Product.js";
import { isDatabaseConnected } from "../config/db.js";
import { getMemoryStore } from "../config/memoryStore.js";

// ============================================================================
// [YÊU CẦU CÔ - Controller Backend CRUD Đầu Sách (`products` trong MongoDB)]
// Xử lý đủ 5 nghiệp vụ: Lấy danh sách (+ lọc categoryId), Lấy chi tiết theo ID,
// Thêm mới (POST), Cập nhật (PUT) và Xóa vĩnh viễn (DELETE).
// ============================================================================

const toSlugId = (text = "") => {
  const clean = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 28);
  return clean ? `${clean}-${Date.now().toString().slice(-4)}` : `book-${Date.now()}`;
};

const parsePriceNum = (raw = "") => {
  const digits = Number(String(raw).replace(/[^\d]/g, ""));
  return Number.isFinite(digits) && digits > 0 ? digits : 159000;
};

export const getAllProducts = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      const { products } = getMemoryStore();
      const filtered = req.query.categoryId
        ? products.filter((p) => String(p.categoryId) === String(req.query.categoryId))
        : products;
      return res.json(filtered);
    }

    const filter = {};
    if (req.query.categoryId) {
      filter.categoryId = String(req.query.categoryId);
    }
    const list = await Product.find(filter).sort({ createdAt: 1 });
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      const { products } = getMemoryStore();
      const item = products.find((p) => String(p.id) === String(req.params.id));
      if (!item) {
        return res.status(404).json({ message: "Không tìm thấy đầu sách" });
      }
      return res.json(item);
    }

    const item = await Product.findOne({ id: req.params.id });
    if (!item) {
      return res.status(404).json({ message: "Không tìm thấy đầu sách" });
    }
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.price || !body.desc) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đủ Tên sách, Giá bán và Mô tả nội dung" });
    }

    const customId =
      body.id && String(body.id).trim() ? String(body.id).trim() : toSlugId(body.name);
    const basePrice = parsePriceNum(body.price);

    const payload = {
      ...body,
      id: customId,
      image: body.image || "/images/book-covers/hsk-1.jpg",
      author: body.author || "Ban Biên Tập HANZI",
      publisher: body.publisher || "NXB Đại Học Ngôn Ngữ Bắc Kinh",
      pages: Number(body.pages) || 240,
      publishYear: Number(body.publishYear) || 2025,
      isbn:
        body.isbn && String(body.isbn).trim()
          ? String(body.isbn).trim()
          : `978-7-5619-${Date.now().toString().slice(-4)}-8`,
      editions: body.editions || {
        paperback: {
          label: "Bìa mềm tiêu chuẩn",
          price: basePrice,
          stock: 20,
          dimensions: "18.5 × 26 cm · Giấy kem chống lóa",
        },
        hardcover: {
          label: "Bìa cứng vải bố dập nhũ",
          price: Math.round((basePrice * 1.45) / 1000) * 1000,
          stock: 8,
          dimensions: "19 × 26.5 cm · Khâu chỉ mở phẳng 180°",
        },
      },
      features:
        Array.isArray(body.features) && body.features.length > 0
          ? body.features
          : [
              "In 2 màu trên giấy kem 100gsm chống mỏi mắt",
              "Tặng kèm mã QR Audio chuẩn giọng Bắc Kinh",
            ],
    };

    if (!isDatabaseConnected()) {
      const { products } = getMemoryStore();
      products.push(payload);
      return res.status(201).json(payload);
    }

    const created = await Product.create(payload);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      const { products } = getMemoryStore();
      const idx = products.findIndex((p) => String(p.id) === String(req.params.id));
      if (idx === -1) {
        return res.status(404).json({ message: "Không tìm thấy đầu sách để cập nhật" });
      }
      products[idx] = { ...products[idx], ...req.body, id: req.params.id };
      return res.json(products[idx]);
    }

    const updated = await Product.findOneAndUpdate(
      { id: req.params.id },
      { $set: { ...req.body, id: req.params.id } },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy đầu sách để cập nhật" });
    }
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      const { products } = getMemoryStore();
      const idx = products.findIndex((p) => String(p.id) === String(req.params.id));
      if (idx === -1) {
        return res.status(404).json({ message: "Không tìm thấy đầu sách để xóa" });
      }
      products.splice(idx, 1);
      return res.json({ success: true, id: req.params.id });
    }

    const deleted = await Product.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy đầu sách để xóa" });
    }
    return res.json({ success: true, id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
