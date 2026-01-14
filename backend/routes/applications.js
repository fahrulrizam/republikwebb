

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // WAJIB ada
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. MIDDLEWARE WAJIB: JSON Parser
app.use(express.json());

// 2. MIDDLEWARE WAJIB: CORS Configuration
// Ini mengizinkan frontend (yang berjalan di port yang berbeda) untuk mengirim request ke backend.
// Asumsi frontend Anda berjalan di localhost:5173 atau port sejenis.
app.use(cors({
    origin: '*', // Untuk debugging lokal, kita pakai wildcard.
    // origin: 'http://localhost:5173', // Jika Anda tahu port frontendnya
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));

// ... (Bagian koneksi MongoDB menggunakan mongoose/dotenv)
// Pastikan bagian ini sama dengan yang ada di screenshot Anda (image_ebd208.png)
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Atlas Connected successfully!'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
    
    });

// ... (Bagian Import Routes)
// Contoh: const applicationRoutes = require('./routes/applicationRoutes');
// app.use('/api/applications', applicationRoutes);

// ... (Bagian Error Handling)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});