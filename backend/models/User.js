// models/User.js
const mongoose = require('mongoose');

// Skema ini harus mencerminkan semua data yang Anda kirim dari frontend
const userSchema = new mongoose.Schema({
    // INFORMASI PRIBADI
    namaLengkap: {
        type: String,
        required: [true, 'Nama lengkap wajib diisi.'], // Wajib
        trim: true
    },
    emailAktif: {
        type: String,
        required: [true, 'Email wajib diisi.'],
        unique: true, // Tidak boleh ada duplikasi email
        lowercase: true,
        trim: true
    },
    nomorWhatsApp: {
        type: String,
        required: [true, 'Nomor WhatsApp wajib diisi.']
    },
    universitasSekolah: {
        type: String,
        required: [true, 'Institusi wajib diisi.']
    },
    
    // DETAIL APLIKASI
    jurusan: {
        type: String,
        required: [true, 'Jurusan wajib diisi.']
    },
    posisiMagang: {
        type: String,
        required: [true, 'Posisi magang wajib diisi.']
    },
    linkPortfolio: {
        type: String,
        required: [true, 'Link Portfolio/CV wajib diisi.'] 
    },
    
    // TIMESTAMP
    tanggalDaftar: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;