import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    badge: { type: String, default: "" },
    price: { type: String, required: true },
    originalPrice: { type: String, default: "" },
    period: { type: String, default: "" },
    desc: { type: String, default: "" },
    features: { type: [String], default: [] },
    popular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

planSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
});

export const Plan = mongoose.model("Plan", planSchema);
