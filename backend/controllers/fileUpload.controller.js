import Truck from "../models/truck.model.js";
import XLSX from "xlsx";

export const uploadExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const trucks = data.map(row => ({
      truckId: row.truckId,
      capacity: row.capacity,
      assignedLoad: row.assignedLoad,
      company: row.company,
    }));
    await Truck.deleteMany({});
    await Truck.insertMany(trucks);
    res.status(200).json({ message: "Excel uploaded successfully", trucks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};