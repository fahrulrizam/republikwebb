// server.js

// --- 1. SETUP DAN IMPOR ---
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const User = require('./models/User'); // Pastikan file ini ada di ./models/User.js

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI; 

// --- 2. MIDDLEWARE ---
// Wajib: Izinkan server untuk membaca body permintaan sebagai JSON
app.use(express.json()); 

// Wajib: Konfigurasi CORS: Izinkan permintaan dari semua origin (mengatasi 'Failed to fetch' di development)
app.use(cors());

// --- 3. KONEKSI DATABASE ---
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Atlas Connected successfully!'))
    .catch(err => {
        // PERBAIKAN: Jika ada 'bad auth' (password salah), tampilkan error dan HENTIKAN server
        console.error('❌ MongoDB connection error: Harap periksa MONGODB_URI dan Password Anda. Error:', err.message);
        process.exit(1); 
    });


// --- 4. RUTE UTAMA (Testing Koneksi) ---
app.get('/', (req, res) => {
    res.send('Server is running and connected to MongoDB!');
});


// --- 5. RUTE BARU UNTUK MENYIMPAN DATA APLIKASI ---
app.post('/api/register', async (req, res) => {
    try {
        // Ambil data dari body permintaan
        const { 
            nama, 
            jurusan, 
            whatsapp, 
            emailAktif, 
            universitasSekolah, 
            posisiMagang, 
            linkPortfolio 
        } = req.body;
        
        // Buat instance baru dari model User, memetakan data body ke properti skema
        const newUser = new User({
            namaLengkap: nama, 
            emailAktif: emailAktif,
            nomorWhatsApp: whatsapp,
            universitasSekolah: universitasSekolah,
            jurusan: jurusan,
            posisiMagang: posisiMagang,
            linkPortfolio: linkPortfolio
        });
        
        const savedUser = await newUser.save(); // Menyimpan data
        
        // Kirim response sukses (Status 201 Created)
        res.status(201).json({ 
            message: "Data pendaftar berhasil disimpan!",
            data: savedUser 
        });
        
    } catch (err) {
        // PERBAIKAN: Penanganan error yang lebih spesifik untuk Validasi
        
        // 1. Error Duplikasi Data (Status 409)
        if (err.code === 11000) {
            console.error("Duplikasi Data:", err.keyValue);
            return res.status(409).json({ error: 'Email atau data unik lainnya sudah terdaftar.' });
        }
        
        // 2. Error Validasi Mongoose (Status 400 - Data tidak lengkap/format salah)
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            console.error("Validasi Gagal:", messages);
            return res.status(400).json({ error: `Validasi gagal. Pastikan semua kolom terisi: ${messages.join(', ')}` });
        }

        console.error("Error saat menyimpan data tak terduga:", err);
        // Kirim response error umum
        res.status(500).json({ error: 'Gagal mengirim aplikasi. Terjadi kesalahan server.' });
    }
});


// --- 6. START SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});