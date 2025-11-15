// server.js

// --- 1. SETUP DAN IMPOR ---
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const User = require('./models/User'); 

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI; 

// --- 2. MIDDLEWARE & KONFIGURASI CORS (HARUS DI ATAS RUTE) ---

const ALLOWED_ORIGINS = [
    'http://localhost:5173', // IZINKAN FRONTEND LOKAL
    'http://localhost:3000', 
    'https://republikweb-app.onrender.com' // Ganti jika Anda memiliki domain live frontend lain
];

// 1. Konfigurasi CORS SPESIFIK untuk mengatasi konflik protokol/Mixed Content
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (ALLOWED_ORIGINS.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200 
}));

// 2. Izinkan server membaca body permintaan sebagai JSON
app.use(express.json()); 

// --- 3. KONEKSI DATABASE ---
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Atlas Connected successfully!'))
    .catch(err => {
        console.error('❌ MongoDB connection error: Harap periksa MONGODB_URI dan Password Anda. Error:', err.message);
        process.exit(1); 
    });


// --- 4. RUTE UTAMA (Testing Koneksi) ---
app.get('/', (req, res) => {
    res.send('Server is running and connected to MongoDB!');
});


// --- 5. RUTE BARU UNTUK MENYIMPAN DATA APLIKASI ---
app.post('/api/register', async (req, res) => {
    // ... (Kode ini sudah benar)
    try {
        const { 
            nama, jurusan, whatsapp, emailAktif, universitasSekolah, posisiMagang, linkPortfolio 
        } = req.body;
        
        const newUser = new User({
            namaLengkap: nama, emailAktif: emailAktif, nomorWhatsApp: whatsapp,
            universitasSekolah: universitasSekolah, jurusan: jurusan,
            posisiMagang: posisiMagang, linkPortfolio: linkPortfolio
        });
        
        const savedUser = await newUser.save(); 
        
        res.status(201).json({ 
            message: "Data pendaftar berhasil disimpan!",
            data: savedUser 
        });
        
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Email atau data unik lainnya sudah terdaftar.' });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ error: `Validasi gagal. Pastikan semua kolom terisi: ${messages.join(', ')}` });
        }
        console.error("Error saat menyimpan data tak terduga:", err);
        res.status(500).json({ error: 'Gagal mengirim aplikasi. Terjadi kesalahan server.' });
    }
});


// --- 6. START SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});