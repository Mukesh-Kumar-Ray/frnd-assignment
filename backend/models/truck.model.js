import mongoose from "mongoose";

const truckSchema = new mongoose.Schema({
  truckId: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  assignedLoad: { type: Number, required: true },
  company: { type: String, required: true },
});

const Truck = mongoose.model("Truck", truckSchema);

export default Truck ;
