import express from "express";
import multer from "multer";
import { uploadExcel } from "../controllers/fileUpload.controller.js";

const router = express.Router();
const upload = multer(); 

router.post("/", upload.single("file"), uploadExcel);

export default router;