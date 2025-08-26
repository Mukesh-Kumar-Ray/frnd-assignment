import Truck from "../models/truck.model.js";
import OptimizationReport from "../models/optimizationReport.model.js";
import { Parser } from "json2csv";

// Calculate cost per company 
export const calculateCost = async (req, res) => {
  try {
    // MongoDB aggregation: sum assignedLoad per company
    const companyLoads = await OptimizationReport.aggregate([
      { $match: { costShare: { $gt: 0 } } },
      { $group: { _id: "$company", totalLoad: { $sum: "$costShare" } } },
    ]);
  
    const companyCosts = companyLoads.map((c) => ({
      company: c._id,
      costShare: (c.totalLoad).toFixed(2),
    }));

    res.status(200).json(companyCosts );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Export report as CSV
export const exportReport = async (req, res) => {
  try {
    const totalCost = Number(req.query.totalCost || 3000);

    // Fetch trucks from DB
    const trucks = await Truck.find().lean();

    if (!trucks.length) {
      return res.status(404).json({ message: "No trucks found" });
    }

    // Step 1: Calculate total assigned load
    const totalAssignedLoad = trucks.reduce(
      (sum, t) => sum + (t.assignedLoad || 0),
      0
    );

    // Step 2: Sort trucks by capacity (descending)
    const sortedTrucks = [...trucks].sort((a, b) => b.capacity - a.capacity);

    // Step 3: Greedy allocation
    let remainingLoad = totalAssignedLoad;
    const optimizedReport = [];

    for (const truck of sortedTrucks) {
      let loadForTruck = 0;

      if (remainingLoad > 0) {
        if (remainingLoad >= truck.capacity) {
          loadForTruck = truck.capacity;
          remainingLoad -= truck.capacity;
        } else {
          loadForTruck = remainingLoad;
          remainingLoad = 0;
        }
      }

      optimizedReport.push({
        truckId: truck.truckId,
        company: truck.company,
        capacity: truck.capacity,
        assignedLoad: loadForTruck,
        costShare: totalAssignedLoad
          ? ((loadForTruck / totalAssignedLoad) * totalCost).toFixed(2)
          : 0,
      });
    }
    await OptimizationReport.deleteMany();
    await OptimizationReport.insertMany(optimizedReport);

    // Step 4: Export CSV
    const fields = [
      "truckId",
      "company",
      "capacity",
      "assignedLoad",
      "costShare",
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(await OptimizationReport.find());

    // Send CSV as download
    res.header("Content-Type", "text/csv");
    res.attachment("optimized_report.csv"); 
    res.send(csv);
     
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};
