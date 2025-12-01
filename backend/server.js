// --- 1. SETUP DAN IMPOR ESM ---

// PENTING: Untuk Node.js 20+ dengan "type": "module" di package.json, gunakan
import 'dotenv/config'; 

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Impor model User dari file models/User.js (Pastikan path ini benar)
import User from './models/User.js'; 

const app = express();
// Menggunakan 5000 sebagai fallback port untuk pengembangan lokal
const PORT = process.env.PORT || 5000;
// Menggunakan MONGODB_URI seperti yang didefinisikan di .env (untuk koneksi DB)
const MONGODB_URI = process.env.MONGODB_URI;

// --- 2. MIDDLEWARE & KONFIGURASI CORS ---

// DAFTAR ORIGIN YANG DIIZINKAN (Domain Front-end)
// PERHATIAN: JANGAN tambahkan '/' di akhir URL
const ALLOWED_ORIGINS = [
    'http://localhost:5173', // FRONTEND DEV (Vite/React)
    'http://localhost:5000', // BACKEND LOKAL (Jika diakses dari port lain)
    'https://republikwebb-1.onrender.com', // BACKEND RENDER
    'https://republikwebb-toir.vercel.app', // DOMAIN VERSEL UTAMA 
];

// Konfigurasi CORS yang ketat dengan penanganan sub-domain Vercel
app.use(cors({
    origin: function (origin, callback) {
        // 1. Izinkan permintaan tanpa 'origin' (misal: Postman, permintaan server-ke-server)
        if (!origin) return callback(null, true);

        // Bersihkan origin dari trailing slash (jika ada)
        const cleanedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;

        // 2. Cek apakah origin ada di dalam daftar yang diizinkan (tepat)
        if (ALLOWED_ORIGINS.includes(cleanedOrigin)) {
            return callback(null, true);
        }

        // 🔥 PERBAIKAN EKSPLISIT: Izinkan SEMUA sub-domain Vercel dan Render Preview
        // Sub-domain Vercel biasanya digunakan untuk URL Preview/Branch
        if (cleanedOrigin.endsWith('.vercel.app') || cleanedOrigin.endsWith('.onrender.com')) {
            return callback(null, true);
        }
        
        // 3. Jika tidak diizinkan sama sekali
        const msg = `CORS policy: Access denied for origin ${origin}.`;
        console.warn(msg);
        return callback(new Error(msg), false); 
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Izinkan server membaca body permintaan sebagai JSON
app.use(express.json());

// --- 3. KONEKSI DATABASE ---

// PERBAIKAN KRITIS: Cek keberadaan MONGODB_URI
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI tidak ditemukan. Harap tentukan URI koneksi MongoDB di Environment Variables Render/Lokal.');
}

// Menghubungkan ke MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Atlas Connected successfully!'))
    .catch(err => {
        // MENANGANI KESALAHAN OTENTIKASI
        if (err.message && err.message.includes('auth failed')) {
            console.error('❌ MongoDB connection error: Authentication Failed.');
            console.error('   Periksa kembali USERNAME dan PASSWORD Anda di MONGODB_URI Render.');
        } else {
            console.error('❌ MongoDB connection error:', err.message);
        }
    });

// --- 4. RUTE UTAMA (Testing Koneksi) ---
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Server is running and connected to MongoDB!',
        status: 'OK',
        dbState: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        port: PORT
    });
});


// --- 5. RUTE UNTUK MENYIMPAN DATA APLIKASI ---
app.post('/api/register', async (req, res) => {
    console.log('🔥 1. Permintaan POST /api/register Diterima.'); // LOG PERTAMA
    
    try {
        console.log('🔥 2. Isi req.body:', req.body); // LOG KEDUA

        // De-strukturisasi data dari body
        const {
            nama, jurusan, whatsapp, emailAktif, universitasSekolah, posisiMagang, linkPortfolio
        } = req.body;

        // Cek dasar
        if (!nama || !emailAktif || !posisiMagang) {
            console.log('❌ Validasi Awal Gagal: Data tidak lengkap.');
            return res.status(400).json({ error: 'Data tidak lengkap. Nama, Email, dan Posisi Magang wajib diisi.' });
        }

        // Pengecekan Duplikasi Email 
        const existingUser = await User.findOne({ emailAktif });
        if (existingUser) {
            console.log('❌ Duplikasi Ditemukan: Email sudah terdaftar.');
            return res.status(409).json({ error: 'Email yang Anda masukkan sudah terdaftar.' });
        }

        // Mapping data ke skema Mongoose
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
        console.log('✅ 3. Data Berhasil Disimpan:', savedUser); // LOG KETIGA

        res.status(201).json({
            message: "Data pendaftar berhasil disimpan!",
            data: savedUser
        });

    } catch (err) {
        console.log('🛑 4. ERROR SAAT MEMPROSES PERMINTAAN:', err); // LOG KEEMPAT
        // Mongoose Duplicate Key Error (Kode 11000) - Pengecekan sekunder
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Email yang Anda masukkan sudah terdaftar. (Kesalahan Mongoose Code 11000)' });
        }
        // Mongoose Validation Error 
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ error: `Validasi gagal. Error: ${messages.join(' | ')}` });
        }

        // Kesalahan Server Internal lainnya
        console.error("Error saat menyimpan data tak terduga:", err);
        res.status(500).json({ error: 'Gagal mengirim aplikasi. Terjadi kesalahan server internal.' });
    }
});


// --- 6. START SERVER ---
app.listen(PORT, () => {
    console.log(`\n============================================`);
    console.log(`🚀 Server is running on port ${PORT}`); 
    console.log(`🔗 Endpoint Pendaftaran: /api/register`);
    console.log(`============================================\n`);
});