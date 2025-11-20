// API Serverless Function untuk Vercel (CommonJS Syntax)
// File ini HARUS berada di dalam folder 'api' di root folder backend Anda.

// --- 1. SETUP DAN IMPOR COMMONJS ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Memuat variabel lingkungan dari .env/process.env
require('dotenv').config();

// Asumsi: Model User berada di root project atau path yang diakses dari sini
// JIKA MODEL ANDA ADA DI backend/models/User.js, path-nya adalah './models/User.js'
// JIKA MODEL ANDA ADA DI root/models/User.js, path-nya adalah '../models/User.js'
// Saya asumsikan models/User.js ada di satu level di atas api/
const User = require('../models/User.js'); 

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// --- 2. MIDDLEWARE & KONFIGURASI CORS ---

const ALLOWED_ORIGINS = [
    'http://localhost:5173', 
    'http://localhost:5000',
    'https://republikweb-app.onrender.com' 
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true);
        } else {
            const msg = `CORS policy: Access denied for origin ${origin}.`;
            console.warn(msg);
            return callback(new Error(msg), false); 
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());

// --- 3. KONEKSI DATABASE ---
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI tidak ditemukan di Environment Variables.');
} else if (mongoose.connection.readyState === 0) {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('✅ MongoDB Atlas Connected successfully! (Vercel Function)'))
        .catch(err => {
            console.error('❌ MongoDB connection error:', err.message);
        });
}

// --- 4. RUTE UTAMA (Testing Koneksi) ---
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Serverless API is running!',
        status: 'OK',
        dbState: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        port: PORT
    });
});


// --- 5. RUTE UNTUK MENYIMPAN DATA APLIKASI ---
app.post('/api/register', async (req, res) => {
    try {
        const {
            nama, jurusan, whatsapp, emailAktif, universitasSekolah, posisiMagang, linkPortfolio
        } = req.body;

        if (!nama || !emailAktif || !posisiMagang) {
            return res.status(400).json({ error: 'Data tidak lengkap. Nama, Email, dan Posisi Magang wajib diisi.' });
        }

        const existingUser = await User.findOne({ emailAktif });
        if (existingUser) {
            return res.status(409).json({ error: 'Email yang Anda masukkan sudah terdaftar.' });
        }

        const newUser = new User({
            namaLengkap: nama,
            emailAktif: emailAktif,
            nomorWhatsApp: whatsapp,
            universitasSekolah: universitasSekolah,
            jurusan: jurusan,
            posisiMagang: posisiMagang,
            linkPortfolio: linkPortfolio
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            message: "Data pendaftar berhasil disimpan!",
            data: savedUser
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Email yang Anda masukkan sudah terdaftar. (Kesalahan Mongoose Code 11000)' });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ error: `Validasi gagal. Error: ${messages.join(' | ')}` });
        }

        console.error("Error saat menyimpan data tak terduga:", err);
        res.status(500).json({ error: 'Gagal mengirim aplikasi. Terjadi kesalahan server internal.' });
    }
});


// --- 6. EKSPOR SEBAGAI HANDLER VERCEL SERVERLESS ---
module.exports = app;