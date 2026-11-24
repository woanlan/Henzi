import { Category } from "../models/Category.js";
import { isDatabaseConnected } from "../config/db.js";
import { getMemoryStore } from "../config/memoryStore.js";

// ============================================================================
// [YÊU CẦU CÔ - Controller Backend CRUD Danh Mục (`categories` trong MongoDB)]
// Xử lý đủ 5 nghiệp vụ: GET tất cả, GET chi tiết, POST tạo mới, PUT sửa, DELETE xóa.
// ============================================================================

const toSlug = (text = "") =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getAllCategories = async (_req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.json(getMemoryStore().categories);
    }
    const list = await Category.find().sort({ createdAt: 1 });
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      const item = getMemoryStore().categories.find(
        (c) => String(c.id) === String(req.params.id)
      );
      if (!item) {
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }
      return res.json(item);
    }

    const item = await Category.findOne({ id: req.params.id });
    if (!item) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { id, name, slug, description, icon, count, badge, color } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Tên danh mục không được để trống" });
    }
    const generatedSlug = (slug && String(slug).trim()) || toSlug(name) || `cat-${Date.now()}`;
    const customId = (id && String(id).trim()) || generatedSlug;

    const payload = {
      id: customId,
      name: String(name).trim(),
      slug: generatedSlug,
      description: description || "",
      icon: icon || "BookOpen",
      count: Number(count) || 0,
      badge: badge || "Mới",
      color: color || "#D97706",
    };

    if (!isDatabaseConnected()) {
      const { categories } = getMemoryStore();
      categories.push(payload);
      return res.status(201).json(payload);
    }

    const created = await Category.create(payload);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      const { categories } = getMemoryStore();
      const idx = categories.findIndex((c) => String(c.id) === String(req.params.id));
      if (idx === -1) {
        return res.status(404).json({ message: "Không tìm thấy danh mục để cập nhật" });
      }
      categories[idx] = { ...categories[idx], ...req.body, id: req.params.id };
      return res.json(categories[idx]);
    }

    const updated = await Category.findOneAndUpdate(
      { id: req.params.id },
      { $set: { ...req.body, id: req.params.id } },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy danh mục để cập nhật" });
    }
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      const { categories } = getMemoryStore();
      const idx = categories.findIndex((c) => String(c.id) === String(req.params.id));
      if (idx === -1) {
        return res.status(404).json({ message: "Không tìm thấy danh mục để xóa" });
      }
      categories.splice(idx, 1);
      return res.json({ success: true, id: req.params.id });
    }

    const deleted = await Category.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy danh mục để xóa" });
    }
    return res.json({ success: true, id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
