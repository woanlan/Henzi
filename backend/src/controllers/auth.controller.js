import { User } from "../models/User.js";
import { isDatabaseConnected } from "../config/db.js";
import { getMemoryStore, stripPassword } from "../config/memoryStore.js";

// ============================================================================
// [YÊU CẦU CÔ - Controller Backend Xác Thực (Login/Register) & CRUD Thành Viên]
// Kiểm tra tài khoản đăng nhập (Admin / Độc giả), đăng ký tài khoản mới và
// xử lý CRUD quản lý danh sách người dùng trong MongoDB.
// ============================================================================

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập tên đăng nhập và mật khẩu!" });
    }

    if (!isDatabaseConnected()) {
      const found = getMemoryStore().users.find(
        (u) => u.username === String(username).trim() && u.password === String(password)
      );
      if (!found) {
        return res
          .status(401)
          .json({ success: false, message: "Tên đăng nhập hoặc mật khẩu không chính xác!" });
      }
      return res.json({ success: true, user: stripPassword(found) });
    }

    const found = await User.findOne({
      username: String(username).trim(),
      password: String(password),
    });

    if (!found) {
      return res
        .status(401)
        .json({ success: false, message: "Tên đăng nhập hoặc mật khẩu không chính xác!" });
    }

    return res.json({ success: true, user: found });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password, fullName, phone } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng điền đầy đủ thông tin bắt buộc!" });
    }

    const payload = {
      id: `usr-${Date.now().toString().slice(-5)}`,
      username: String(username).trim(),
      email: String(email).trim(),
      password: String(password),
      fullName: fullName?.trim() || String(username).trim(),
      phone: phone?.trim() || "",
      role: "student",
    };

    if (!isDatabaseConnected()) {
      const { users } = getMemoryStore();
      if (users.some((u) => u.username === payload.username)) {
        return res
          .status(409)
          .json({ success: false, message: "Tên đăng nhập đã tồn tại, vui lòng chọn tên khác!" });
      }
      users.push(payload);
      return res.status(201).json({ success: true, user: stripPassword(payload) });
    }

    const existing = await User.findOne({ username: payload.username });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Tên đăng nhập đã tồn tại, vui lòng chọn tên khác!" });
    }

    const created = await User.create(payload);
    return res.status(201).json({ success: true, user: created });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (_req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.json(getMemoryStore().users.map(stripPassword));
    }
    const list = await User.find().sort({ createdAt: 1 });
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, email, password, fullName, phone, role } = req.body;
    if (!username || !email) {
      return res.status(400).json({ message: "Thiếu tên đăng nhập hoặc email" });
    }

    const payload = {
      id: `usr-${Date.now().toString().slice(-5)}`,
      username: String(username).trim(),
      email: String(email).trim(),
      password: password ? String(password) : "123",
      fullName: fullName?.trim() || String(username).trim(),
      phone: phone?.trim() || "",
      role: role === "admin" ? "admin" : "student",
    };

    if (!isDatabaseConnected()) {
      const { users } = getMemoryStore();
      if (users.some((u) => u.username === payload.username)) {
        return res.status(409).json({ message: "Tên đăng nhập đã tồn tại" });
      }
      users.push(payload);
      return res.status(201).json(stripPassword(payload));
    }

    const existing = await User.findOne({ username: payload.username });
    if (existing) {
      return res.status(409).json({ message: "Tên đăng nhập đã tồn tại" });
    }

    const created = await User.create(payload);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const patch = { ...req.body };
    delete patch.id;
    if (!patch.password) {
      delete patch.password;
    }

    if (!isDatabaseConnected()) {
      const { users } = getMemoryStore();
      const idx = users.findIndex(
        (u) => String(u.id) === String(req.params.id) || u.username === req.params.id
      );
      if (idx === -1) {
        return res.status(404).json({ message: "Không tìm thấy tài khoản" });
      }
      users[idx] = { ...users[idx], ...patch };
      return res.json(stripPassword(users[idx]));
    }

    const updated = await User.findOneAndUpdate(
      { $or: [{ id: req.params.id }, { username: req.params.id }] },
      { $set: patch },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      const { users } = getMemoryStore();
      const idx = users.findIndex(
        (u) => String(u.id) === String(req.params.id) || u.username === req.params.id
      );
      if (idx === -1) {
        return res.status(404).json({ message: "Không tìm thấy tài khoản để xóa" });
      }
      users.splice(idx, 1);
      return res.json({ success: true, id: req.params.id });
    }

    const deleted = await User.findOneAndDelete({
      $or: [{ id: req.params.id }, { username: req.params.id }],
    });
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản để xóa" });
    }
    return res.json({ success: true, id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
