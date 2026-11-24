import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let store = null;

export const stripPassword = (user) => {
  if (!user) return user;
  const copy = { ...user };
  delete copy.password;
  return copy;
};

export const getMemoryStore = () => {
  if (store) return store;

  const seedPath = path.resolve(__dirname, "../seed/seedData.json");
  const raw = JSON.parse(fs.readFileSync(seedPath, "utf8"));
  const totalOrders = (raw.orders || []).length;

  store = {
    categories: (raw.categories || []).map((c) => ({ ...c })),
    products: (raw.products || []).map((p) => ({
      ...p,
      editions: p.editions
        ? {
            paperback: p.editions.paperback ? { ...p.editions.paperback } : undefined,
            hardcover: p.editions.hardcover ? { ...p.editions.hardcover } : undefined,
          }
        : undefined,
      features: Array.isArray(p.features) ? [...p.features] : [],
    })),
    users: (raw.users || []).map((u) => ({ ...u })),
    orders: (raw.orders || []).map((ord, idx) => ({
      ...ord,
      items: Array.isArray(ord.items) ? ord.items.map((it) => ({ ...it })) : [],
      timestampMs: ord.timestampMs ?? (totalOrders - idx) * 1000,
    })),
    vouchers: (raw.vouchers || []).map((v) => ({ ...v })),
    plans: (raw.plans || []).map((p) => ({ ...p })),
    hskCourses: (raw.hskCourses || []).map((h) => ({ ...h })),
  };

  return store;
};
