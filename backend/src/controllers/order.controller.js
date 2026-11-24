import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { isDatabaseConnected } from "../config/db.js";
import { getMemoryStore } from "../config/memoryStore.js";

// ============================================================================
// [YÊU CẦU CÔ - Controller Backend CRUD Đơn Đặt Sách (`orders` trong MongoDB)]
// Sắp xếp đơn mới nhất lên đầu (`timestampMs: -1`), kiểm tra & trừ tồn kho sách,
// tạo đơn đặt mua sách mới, duyệt giao vận / hủy hoàn kho và xóa đơn.
// ============================================================================

const adjustMemoryStock = (items, deltaSign) => {
  if (!Array.isArray(items)) return;
  const { products } = getMemoryStore();
  for (const item of items) {
    const editionKey = item.edition === "hardcover" ? "hardcover" : "paperback";
    const qty = Math.max(1, Number(item.quantity) || 1);
    const book = products.find((p) => String(p.id) === String(item.bookId));
    if (book && book.editions && book.editions[editionKey]) {
      const current = Number(book.editions[editionKey].stock) || 0;
      book.editions[editionKey].stock = Math.max(0, current + deltaSign * qty);
    }
  }
};

export const getAllOrders = async (_req, res) => {
  try {
    if (!isDatabaseConnected()) {
      const sorted = [...getMemoryStore().orders].sort(
        (a, b) => (b.timestampMs || 0) - (a.timestampMs || 0)
      );
      return res.json(sorted);
    }
    const list = await Order.find().sort({ timestampMs: -1 });
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const {
      id,
      studentName,
      email,
      phone,
      shippingAddress,
      courseId,
      courseName,
      items,
      subtotal,
      discountAmount,
      shippingFee,
      totalNumeric,
      amount,
      voucherCode,
      status,
      createdAt,
      timestampMs,
    } = req.body;

    if (!studentName || !phone || !courseName) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin người nhận hoặc đầu sách đặt mua" });
    }

    const now = new Date();
    const formattedTime =
      createdAt ||
      `Hôm nay · ${now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;

    const payload = {
      id: id || `ord-${Date.now().toString().slice(-5)}`,
      studentName: String(studentName).trim(),
      email: email?.trim() || "",
      phone: String(phone).trim(),
      shippingAddress: shippingAddress?.trim() || "",
      courseId: courseId || "hsk-1",
      courseName,
      items: Array.isArray(items) ? items : [],
      subtotal: Number(subtotal) || 0,
      discountAmount: Number(discountAmount) || 0,
      shippingFee: Number(shippingFee) || 0,
      totalNumeric: Number(totalNumeric) || 0,
      amount: amount || "0đ",
      voucherCode: voucherCode?.trim() || "",
      status: status || "pending",
      createdAt: formattedTime,
      timestampMs: timestampMs || now.getTime(),
    };

    if (!isDatabaseConnected()) {
      if (payload.items.length > 0 && payload.status !== "cancelled") {
        adjustMemoryStock(payload.items, -1);
      }
      getMemoryStore().orders.unshift(payload);
      return res.status(201).json(payload);
    }

    // Trừ tồn kho thực tế trong MongoDB nếu có chi tiết items
    if (Array.isArray(items) && items.length > 0 && status !== "cancelled") {
      for (const item of items) {
        const editionKey = item.edition === "hardcover" ? "hardcover" : "paperback";
        const qty = Math.max(1, Number(item.quantity) || 1);
        const bookDoc = await Product.findOne({ id: String(item.bookId) });
        if (bookDoc && bookDoc.editions && bookDoc.editions[editionKey]) {
          const currentStock = Number(bookDoc.editions[editionKey].stock) || 0;
          bookDoc.editions[editionKey].stock = Math.max(0, currentStock - qty);
          await bookDoc.save();
        }
      }
    }

    const created = await Order.create(payload);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      const { orders } = getMemoryStore();
      const idx = orders.findIndex((o) => String(o.id) === String(req.params.id));
      if (idx === -1) {
        return res.status(404).json({ message: "Không tìm thấy đơn đặt sách" });
      }
      const existing = orders[idx];
      if (req.body.status === "cancelled" && existing.status !== "cancelled") {
        adjustMemoryStock(existing.items, +1);
      }
      orders[idx] = { ...existing, ...req.body, id: req.params.id };
      return res.json(orders[idx]);
    }

    const existing = await Order.findOne({ id: req.params.id });
    if (!existing) {
      return res.status(404).json({ message: "Không tìm thấy đơn đặt sách" });
    }

    // Hoàn lại tồn kho nếu đơn chuyển sang trạng thái Đã hủy ("cancelled")
    if (
      req.body.status === "cancelled" &&
      existing.status !== "cancelled" &&
      Array.isArray(existing.items)
    ) {
      for (const item of existing.items) {
        const editionKey = item.edition === "hardcover" ? "hardcover" : "paperback";
        const qty = Math.max(1, Number(item.quantity) || 1);
        const bookDoc = await Product.findOne({ id: String(item.bookId) });
        if (bookDoc && bookDoc.editions && bookDoc.editions[editionKey]) {
          bookDoc.editions[editionKey].stock =
            (Number(bookDoc.editions[editionKey].stock) || 0) + qty;
          await bookDoc.save();
        }
      }
    }

    const updated = await Order.findOneAndUpdate(
      { id: req.params.id },
      { $set: { ...req.body, id: req.params.id } },
      { new: true, runValidators: true }
    );
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      const { orders } = getMemoryStore();
      const idx = orders.findIndex((o) => String(o.id) === String(req.params.id));
      if (idx === -1) {
        return res.status(404).json({ message: "Không tìm thấy đơn để xóa" });
      }
      const [deleted] = orders.splice(idx, 1);
      if (deleted.status === "pending") {
        adjustMemoryStock(deleted.items, +1);
      }
      return res.json({ success: true, id: req.params.id });
    }

    const deleted = await Order.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy đơn để xóa" });
    }

    // Nếu xóa trực tiếp một đơn đang chờ xác nhận ("pending") chưa hủy, hoàn lại tồn kho sách
    if (deleted.status === "pending" && Array.isArray(deleted.items)) {
      for (const item of deleted.items) {
        const editionKey = item.edition === "hardcover" ? "hardcover" : "paperback";
        const qty = Math.max(1, Number(item.quantity) || 1);
        const bookDoc = await Product.findOne({ id: String(item.bookId) });
        if (bookDoc && bookDoc.editions && bookDoc.editions[editionKey]) {
          bookDoc.editions[editionKey].stock =
            (Number(bookDoc.editions[editionKey].stock) || 0) + qty;
          await bookDoc.save();
        }
      }
    }

    return res.json({ success: true, id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
