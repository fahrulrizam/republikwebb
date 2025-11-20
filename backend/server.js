// --- 1. SETUP DAN IMPOR ---
import * as dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Konfigurasi Dotenv untuk memuat variabel dari .env
dotenv.config();

const app = express();
// Menggunakan 5000 sebagai fallback port agar konsisten dengan kebutuhan frontend.
const PORT = process.env.PORT || 5000; 
const MONGODB_URI = process.env.MONGODB_URI;

// Variabel untuk menahan Mongoose Model setelah di-load
let User; 

// --- 2. MIDDLEWARE & KONFIGURASI CORS ---

// List Origin yang Diizinkan (Front-end domains)
const ALLOWED_ORIGINS = [
    'http://localhost:5173', // FRONTEND DEV (Vite/React)
    'http://localhost:5000', 
    'https://republikweb-app.onrender.com' // Contoh domain production
];

// Konfigurasi CORS
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
    console.error('❌ MONGODB_URI tidak ditemukan di file .env. Harap tentukan URI koneksi MongoDB.');
    process.exit(1);
}

// Menghubungkan ke MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Atlas Connected successfully!'))
    .catch(err => {
        // MENANGANI KESALAHAN OTENTIKASI (BAD AUTH)
        if (err.message && err.message.includes('auth failed')) {
            console.error('❌ MongoDB connection error: Authentication Failed.');
            console.error('   Periksa kembali USERNAME dan PASSWORD Anda di file .env untuk MONGODB_URI.');
            console.error('   Pastikan pengguna memiliki izin akses yang benar.');
        } else {
            console.error('❌ MongoDB connection error:', err.message);
        }
        
        // Hentikan proses jika koneksi DB gagal
        process.exit(1);
    });


// --- 4. RUTE UTAMA (Testing Koneksi) ---
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Server is running and connected to MongoDB!',
        status: 'OK',
        dbState: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});


// --- 5. RUTE UNTUK MENYIMPAN DATA APLIKASI ---
app.post('/api/register', async (req, res) => {
    try {
        // Dynamic Import Model: Memastikan model di-load hanya sekali
        if (!User) {
            try {
                // Import Model User (pastikan path ke file models/User.js benar)
                const UserModule = await import('./models/User.js');
                // Mongoose model sering diekspor sebagai 'default' di ES Modules
                User = UserModule.default || UserModule; 
                console.log("Model User dimuat secara dinamis.");
            } catch (importError) {
                console.error("❌ Gagal memuat Model User. Pastikan file './models/User.js' ada dan export model dengan benar.", importError.message);
                return res.status(500).json({ error: 'Kesalahan server: Gagal memuat model data.' });
            }
        }

        const {
            nama, jurusan, whatsapp, emailAktif, universitasSekolah, posisiMagang, linkPortfolio
        } = req.body;

        // Cek apakah ada data yang kosong (dasar)
        if (!nama || !emailAktif || !posisiMagang) {
            return res.status(400).json({ error: 'Data tidak lengkap. Nama, Email, dan Posisi Magang wajib diisi.' });
        }
        
        // Cek apakah email sudah terdaftar (Pengecekan awal untuk respon lebih cepat)
        const existingUser = await User.findOne({ emailAktif });
        if (existingUser) {
             return res.status(409).json({ error: 'Email yang Anda masukkan sudah terdaftar.' });
        }


        // Mapping data dari request ke skema Mongoose
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
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`🔗 Endpoint Pendaftaran: http://localhost:${PORT}/api/register`);
    console.log(`============================================\n`);
});