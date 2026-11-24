import mongoose from "mongoose";

const hskCourseSchema = new mongoose.Schema(
  {
    level: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    titleVn: { type: String, required: true },
    description: { type: String, default: "" },
    requiredVocabCount: { type: Number, default: 150 },
    passingScore: { type: Number, default: 120 },
    maxScore: { type: Number, default: 200 },
    colorHex: { type: String, default: "#D97706" },
  },
  { timestamps: true }
);

hskCourseSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
});

export const HskCourse = mongoose.model("HskCourse", hskCourseSchema);
