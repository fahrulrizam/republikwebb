import mongoose from 'mongoose';

// Definisikan Skema Pendaftar
const userSchema = new mongoose.Schema({
    namaLengkap: {
        type: String,
        required: [true, 'Nama lengkap wajib diisi.'],
        trim: true
    },
    emailAktif: {
        type: String,
        required: [true, 'Email aktif wajib diisi.'],
        unique: true, // Pastikan email unik (akan memicu error 11000 di server.js)
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Harap masukkan email yang valid.']
    },
    nomorWhatsApp: {
        type: String,
        trim: true,
        default: null
    },
    universitasSekolah: {
        type: String,
        trim: true,
        default: null
    },
    jurusan: {
        type: String,
        trim: true,
        default: null
    },
    posisiMagang: {
        type: String,
        required: [true, 'Posisi magang wajib diisi.'],
        enum: ['Frontend Developer', 'Backend Developer', 'UI/UX Designer', 'Digital Marketing', 'Lainnya'],
        trim: true
    },
    linkPortfolio: {
        type: String,
        trim: true,
        default: null
    },
    tanggalPendaftaran: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true }); // Tambahkan createdAt dan updatedAt

// Buat Model dari Skema
const User = mongoose.model('User', userSchema);

// Ekspor Model sebagai default agar kompatibel dengan Dynamic Import di server.js
export default User;