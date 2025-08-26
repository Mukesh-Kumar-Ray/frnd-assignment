import express from "express";
import { calculateCost, exportReport } from "../controllers/truck.controller.js";

const router = express.Router();
router.post("/calculate-cost", calculateCost);
router.get("/export-report", exportReport);

export default router;