import mongoose from "mongoose";
import { Plan } from "../models/Plan.js";
import { HskCourse } from "../models/HskCourse.js";
import { isDatabaseConnected } from "../config/db.js";
import { getMemoryStore } from "../config/memoryStore.js";

// [YÊU CẦU CÔ - Controller Kiểm Tra Kết Nối MongoDB (/api/health), Bộ Boxset & Lộ Trình HSK]

export const getHealth = (_req, res) => {
  const dbReady = isDatabaseConnected();
  return res.json({
    ok: true,
    database: dbReady ? "MongoDB" : "MemoryFallback",
    dbName: dbReady ? mongoose.connection.name || "hanzi_master" : "hanzi_master_memory",
    status: dbReady ? "connected" : "fallback",
  });
};

export const getAllPlans = async (_req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.json(getMemoryStore().plans);
    }
    const list = await Plan.find().sort({ createdAt: 1 });
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllHskCourses = async (_req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.json(getMemoryStore().hskCourses);
    }
    const list = await HskCourse.find().sort({ level: 1 });
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
