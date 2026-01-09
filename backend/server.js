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
    const { 
        namaLengkap, 
        jurusan, 
        whatsapp, 
        emailAktif, 
        universitasSekolah, 
        posisiMagang, 
        linkPortfolio 
    } = req.body;
    
    try {
        const newUser = new User({
            // PERBAIKAN DI SINI: Gunakan namaLengkap, bukan nama
            namaLengkap: namaLengkap || "Subscriber", 
            emailAktif: emailAktif,
            nomorWhatsApp: whatsapp || "0",
            universitasSekolah: universitasSekolah || "Newsletter",
            jurusan: jurusan || "Newsletter",
            posisiMagang: posisiMagang || "Newsletter Subscriber",
            linkPortfolio: linkPortfolio || "N/A"
        });
        
        const savedUser = await newUser.save();
        
        res.status(201).json({ 
            message: "Data pendaftar berhasil disimpan!",
            data: savedUser 
        });
        
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Email ini sudah terdaftar.' });
        }
        
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: 'Validasi gagal. Pastikan format benar.' });
        }

        res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
});


// --- 6. START SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});