// server.js final version

// --- 1. SETUP DAN IMPOR ---
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const User = require('./models/User'); 

const app = express();

// Render akan otomatis memberikan port melalui process.env.PORT
const PORT = process.env.PORT || 5000; 
const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI; 

// --- 2. MIDDLEWARE ---
app.use(express.json()); 

// Konfigurasi CORS yang lebih aman
app.use(cors({
    origin: '*', // Nantinya ganti '*' dengan URL Frontend Anda (misal: https://web-anda.vercel.app)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- 3. KONEKSI DATABASE ---
if (!MONGODB_URI) {
    console.error("❌ Variabel MONGO_URI tidak ditemukan! Pastikan sudah di-set di Dashboard Render (Environment).");
    process.exit(1);
}

// Menambahkan opsi koneksi untuk stabilitas di cloud
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Atlas Connected successfully!'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        // Jangan langsung exit jika di server, biarkan Render mencoba restart otomatis
    });

// --- 4. RUTE UTAMA ---
app.get('/', (req, res) => {
    res.json({ 
        status: "Active", 
        message: "Republikweb Backend is running!",
        database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
    });
});

// --- 5. RUTE API APLIKASI (POST) ---
app.post('/api/applications', async (req, res) => {
    // Destructuring data dari body
    const { 
        namaLengkap, 
        jurusan, 
        whatsapp, 
        emailAktif, 
        universitasSekolah, 
        posisiMagang, 
        linkPortfolio 
    } = req.body;
    
    // Validasi sederhana sebelum memproses ke database
    if (!emailAktif) {
        return res.status(400).json({ error: 'Email wajib diisi.' });
    }

    try {
        const newUser = new User({
            namaLengkap: namaLengkap || "Subscriber", 
            emailAktif: emailAktif,
            nomorWhatsApp: whatsapp || "0",
            universitasSekolah: universitasSekolah || "Newsletter",
            jurusan: jurusan || "Newsletter",
            posisiMagang: posisiMagang || "Newsletter Subscriber",
            linkPortfolio: linkPortfolio || "N/A"
        });
        
        const savedUser = await newUser.save();
        
        return res.status(201).json({ 
            success: true,
            message: "Data pendaftar berhasil disimpan!",
            data: savedUser 
        });
        
    } catch (err) {
        // Handle Error Duplikasi Email (Unique Key di MongoDB)
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Email ini sudah terdaftar di sistem kami.' });
        }
        
        // Handle Error Validasi Mongoose
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: 'Format data tidak valid.', details: err.message });
        }

        console.error("Server Error:", err);
        return res.status(500).json({ error: 'Terjadi kesalahan pada server internal.' });
    }
});

// --- 6. START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});