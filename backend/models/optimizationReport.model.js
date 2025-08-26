import mongoose from "mongoose";

const optimizationReportSchema = new mongoose.Schema(
  {
    truckId: { type: String, required: true },
    company: { type: String, required: true },
    capacity: { type: Number, required: true },
    assignedLoad: { type: Number, required: true },
    costShare: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("OptimizationReport", optimizationReportSchema);
