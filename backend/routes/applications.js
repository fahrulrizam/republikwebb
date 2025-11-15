import express from "express";
import Application from "../models/Application.js";

const router = express.Router();

// POST untuk menyimpan data aplikasi
router.post("/", async (req, res) => {
  try {
    const newApp = new Application(req.body);
    await newApp.save();
    res.status(201).json({ message: "Aplikasi berhasil dikirim!" });
  } catch (err) {
    console.error("❌ Gagal menyimpan data:", err);
    res.status(500).json({ message: "Gagal menyimpan data aplikasi." });
  }
});

// GET untuk mengambil semua data aplikasi
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (err) {
    console.error("❌ Gagal mengambil data:", err);
    res.status(500).json({ message: "Gagal mengambil data aplikasi." });
  }
});

export default router;
