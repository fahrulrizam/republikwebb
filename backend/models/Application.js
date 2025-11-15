import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  nama: String,
  email: String,
  whatsapp: String,
  sekolah: String,
  jurusan: String,
  posisi: String,
  link_cv: String,
  motivasi: String,
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);
