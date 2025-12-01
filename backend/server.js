// --- 1. SETUP DAN IMPOR ESM ---

// Solusi 1: Paling umum dan direkomendasikan untuk ESM.
// Ini menjalankan konfigurasi dotenv segera, tanpa perlu dotenv.config() secara eksplisit.
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
// PASTIKAN URL VERSEL ANDA ADA DI SINI AGAR FRONT-END BISA AKSES BACKEND!
const ALLOWED_ORIGINS = [
    'http://localhost:5173', // FRONTEND DEV (Vite/React)
    'http://localhost:5000', // BACKEND LOKAL (Jika diakses dari port lain)
    'https://republikwebb-1.onrender.com', // BACKEND RENDER (Tidak wajib, tapi aman)
    'https://republikwebb-to1r.vercel.app/', // DOMAIN VERSEL YANG SUDAH BERHASIL DEPLOY
    // Tambahkan domain Vercel lainnya di sini jika ada:
    // 'https://nama-proyek-lain.vercel.app' 
];

// Konfigurasi CORS yang ketat
app.use(cors({
    origin: function (origin, callback) {
        // Izinkan permintaan tanpa 'origin' (misal: Postman, permintaan server-ke-server)
        if (!origin) return callback(null, true);

        // Cek apakah origin yang meminta ada di dalam daftar yang diizinkan
        if (ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true);
        } else {
            const msg = `CORS policy: Access denied for origin ${origin}.`;
            console.warn(msg);
            // Standar keamanan: Tolak permintaan yang tidak diizinkan
            return callback(new Error(msg), false); 
        }
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
    // Hentikan proses hanya di lokal/lingkungan dev. Di Render, proses akan otomatis mati jika gagal.
    // process.exit(1); 
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

        // Hentikan proses jika koneksi DB gagal
        // process.exit(1); // Nonaktifkan exit agar Render dapat mencoba kembali
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
    try {
        // De-strukturisasi data dari body
        const {
            nama, jurusan, whatsapp, emailAktif, universitasSekolah, posisiMagang, linkPortfolio
        } = req.body;

        // Cek dasar (dapat dihapus jika validasi Mongoose sudah cukup ketat)
        if (!nama || !emailAktif || !posisiMagang) {
            return res.status(400).json({ error: 'Data tidak lengkap. Nama, Email, dan Posisi Magang wajib diisi.' });
        }

        // Pengecekan Duplikasi Email (agar respon lebih cepat sebelum mencoba menyimpan)
        const existingUser = await User.findOne({ emailAktif });
        if (existingUser) {
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

        res.status(201).json({
            message: "Data pendaftar berhasil disimpan!",
            data: savedUser
        });

    } catch (err) {
        // Mongoose Duplicate Key Error (Kode 11000) - Pengecekan sekunder
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Email yang Anda masukkan sudah terdaftar. (Kesalahan Mongoose Code 11000)' });
        }
        // Mongoose Validation Error (kesalahan format atau data tidak sesuai skema)
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
    // Output yang menunjukkan server berjalan dengan port Render (jika ada)
    console.log(`🚀 Server is running on port ${PORT}`); 
    console.log(`🔗 Endpoint Pendaftaran: /api/register`);
    console.log(`============================================\n`);
});