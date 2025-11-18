// server.js

// --- 1. SETUP DAN IMPOR ---
// Wajib dimuat paling awal untuk membaca .env
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const User = require('./models/User'); 

const app = express();
const PORT = process.env.PORT || 3000;
// PERBAIKAN KRITIS: Ganti process.env.MONGODB_URI menjadi process.env.MONGO_URI
// atau pastikan nama variabel di file .env adalah MONGODB_URI.
// (Diasumsikan Anda menggunakan MONGO_URI di file .env sebelumnya, maka kami sesuaikan di sini)
const MONGODB_URI = process.env.MONGO_URI; 

// --- 2. MIDDLEWARE ---
app.use(express.json()); 
app.use(cors());

// --- 3. KONEKSI DATABASE ---
// Pengecekan agar MONGODB_URI tidak undefined sebelum mencoba connect
if (!MONGODB_URI) {
    console.error("❌ Variabel MONGO_URI tidak ditemukan di file .env!");
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Atlas Connected successfully!'))
    .catch(err => {
        // Penanganan error koneksi (autentikasi atau jaringan)
        console.error('❌ MongoDB connection error: Harap periksa MONGODB_URI dan Password Anda. Error:', err.message);
        process.exit(1); 
    });


// --- 4. RUTE UTAMA (Testing Koneksi) ---
app.get('/', (req, res) => {
    res.send('Server is running and connected to MongoDB!');
});


// --- 5. RUTE BARU UNTUK MENYIMPAN DATA APLIKASI ---
app.post('/api/applications', async (req, res) => {
    // De-strukturisasi untuk kemudahan membaca
    const { 
        nama, 
        jurusan, 
        whatsapp, 
        emailAktif, 
        universitasSekolah, 
        posisiMagang, 
        linkPortfolio 
    } = req.body;
    
    try {
        // Buat instance baru
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
        
        res.status(201).json({ 
            message: "Data pendaftar berhasil disimpan!",
            data: savedUser 
        });
        
    } catch (err) {
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

        // Error Tak Terduga (Status 500)
        console.error("Error saat menyimpan data tak terduga:", err);
        res.status(500).json({ error: 'Gagal mengirim aplikasi. Terjadi kesalahan server.' });
    }
});


// --- 6. START SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});