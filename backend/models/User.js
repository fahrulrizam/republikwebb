import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    // Nama Lengkap (Wajib)
    namaLengkap: {
        type: String,
        required: [true, 'Nama lengkap wajib diisi.'],
        trim: true,
    },
    // Email Aktif (Wajib, harus unik)
    emailAktif: {
        type: String,
        required: [true, 'Email aktif wajib diisi.'],
        unique: true, // Dipastikan unik di database
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Harap masukkan alamat email yang valid.'],
    },
    // Nomor WhatsApp
    nomorWhatsApp: {
        type: String,
        trim: true,
        default: null
    },
    // Universitas/Sekolah
    universitasSekolah: {
        type: String,
        trim: true,
        default: null
    },
    // Jurusan
    jurusan: {
        type: String,
        trim: true,
        default: null
    },
    // Posisi Magang yang Dilamar (Wajib)
    posisiMagang: {
        type: String,
        required: [true, 'Posisi magang wajib diisi.'],
        trim: true,
    },
    // Link Portofolio
    linkPortfolio: {
        type: String,
        trim: true,
        default: null
    }
}, {
    timestamps: true // Menambahkan createdAt dan updatedAt
});

// Indeks untuk memastikan pencarian cepat dan keunikan
UserSchema.index({ emailAktif: 1 }, { unique: true });

// Buat Model
const User = mongoose.model('User', UserSchema);

export default User;