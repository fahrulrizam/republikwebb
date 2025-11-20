import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
// Menggunakan AlertTriangle untuk tampilan error yang lebih baik
import { Send, Upload, CheckCircle, AlertTriangle } from "lucide-react";
// MEMPERBAIKI: Menggunakan path yang umum ditemukan di proyek React/Supabase
import { supabase } from "../lib/supabase"; 

// --- TYPE DEFINITIONS ---
// Pastikan skema type ini sesuai dengan Supabase table positions
type Position = {
  id: string; // Kritis: Ini adalah UUID (varchar atau uuid)
  title: string;
};

// Pastikan field-field ini sesuai dengan NAMA KOLOM di Supabase table applications
type FormData = {
  full_name: string;
  email: string;
  phone: string;
  school_university: string;
  major: string;
  position_id: string; // Ini akan menampung UUID Posisi
  cv_url: string;
  motivation: string;
};

// --- INITIAL STATE ---
const initialFormData: FormData = {
  full_name: "",
  email: "",
  phone: "",
  school_university: "",
  major: "",
  position_id: "",
  cv_url: "",
  motivation: "",
};


export default function ApplicationForm() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // State untuk penanganan error yang ditampilkan di UI
  const [submissionError, setSubmissionError] = useState<string | null>(null); 
  
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // --- Ambil daftar posisi dari Supabase ---
  useEffect(() => {
    const fetchPositions = async () => {
      setSubmissionError(null); // Reset error sebelum fetching
      try {
        const { data, error } = await supabase
          .from("positions")
          // Menggabungkan select dari main dan filter is_active dari master
          .select("id, title") 
          .eq("is_active", true) 
          .order("title", { ascending: true });

        if (error) throw error;
        setPositions(data || []);
      } catch (err: any) {
        console.error("❌ Gagal mengambil data posisi:", err.message);
        // Tampilkan pesan kesalahan di UI jika gagal memuat posisi
        setSubmissionError("Gagal memuat daftar posisi. Cek koneksi Supabase Anda.");
      }
    };

    fetchPositions();
  }, []);

  // --- Handle perubahan input ---
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- Kirim form ke SUPABASE (Logika INSERT yang robust) ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false); 
    setSubmissionError(null); 

    // Validasi dasar posisi (walaupun sudah ada 'required' di JSX)
    if (!formData.position_id) {
        setSubmissionError("Mohon pilih posisi yang dilamar.");
        setLoading(false);
        return;
    }

    // Payload menggunakan NAMA KOLOM Supabase
    const payload = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        school_university: formData.school_university,
        major: formData.major,
        position_id: formData.position_id, 
        cv_url: formData.cv_url,
        motivation: formData.motivation,
    };

    try {
      // Menggunakan Supabase Client untuk INSERT
      const { error } = await supabase
        .from("applications")
        .insert([payload]);

      if (error) {
        // Jika Supabase mengembalikan error (misalnya RLS ditolak, atau data invalid)
        throw error;
      }

      setSuccess(true);
      // Reset form menggunakan initialFormData
      setFormData(initialFormData);

      // Hilangkan pesan sukses setelah 4 detik
      setTimeout(() => setSuccess(false), 4000);
      
    } catch (err: any) {
      console.error("❌ Error Supabase:", err.message, err);
      
      let errorMessage = "Terjadi kesalahan yang tidak diketahui.";
      if (err.message && err.message.includes('duplicate key')) {
        // Penanganan khusus untuk error duplikasi (misalnya email sudah terdaftar)
        errorMessage = "Email yang Anda masukkan sudah terdaftar. Silakan gunakan email lain.";
      } else if (err.message) {
        // Gunakan pesan error dari Supabase
        errorMessage = err.message;
      } 
      
      setSubmissionError("Gagal mengirim aplikasi: " + errorMessage); 
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="application-form" className="py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-blue-800 mb-4 font-inter">
              Daftar Program Magang
            </h2>
            <p className="text-xl text-gray-600">
              Lengkapi form di bawah ini dan mulai perjalanan karir digitalmu!
            </p>
          </div>

          {/* ✅ Pesan sukses */}
          {success && (
            <div className="mb-8 bg-green-50 border-2 border-green-500 rounded-2xl p-6 flex items-start gap-4 shadow-md animate-in fade-in">
              <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-green-900 text-lg mb-1">
                  Berhasil!
                </h3>
                <p className="text-green-700">
                  Aplikasi Anda telah diterima. Kami akan menghubungi Anda segera!
                </p>
              </div>
            </div>
          )}

          {/* ❌ Pesan Error Supabase */}
          {submissionError && (
            <div className="mb-8 bg-red-50 border-2 border-red-500 rounded-2xl p-6 flex items-start gap-4 shadow-md animate-in fade-in">
              <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-900 text-lg mb-1">
                  Gagal Mengirim Aplikasi
                </h3>
                {/* Menampilkan pesan error yang spesifik dari Supabase */}
                <p className="text-red-700 text-sm break-words">
                  Pesan Error: **{submissionError}**
                </p>
                {/* Tambahkan saran umum */}
                <p className="text-red-700 text-sm mt-2 font-medium">
                  * Pastikan semua kolom terisi dengan format yang benar.
                </p>
              </div>
            </div>
          )}

          {/* ✅ Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-100"
          >
            {/* Nama & Email */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="full_name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* WhatsApp & Sekolah */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  No. WhatsApp *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
                  placeholder="08123456789"
                />
              </div>

              <div>
                <label htmlFor="school_university" className="block text-sm font-semibold text-gray-700 mb-2">
                  Sekolah / Universitas *
                </label>
                <input
                  type="text"
                  id="school_university"
                  name="school_university"
                  value={formData.school_university}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
                  placeholder="Universitas XYZ"
                />
              </div>
            </div>

            {/* Jurusan & Posisi */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="major" className="block text-sm font-semibold text-gray-700 mb-2">
                  Jurusan *
                </label>
                <input
                  type="text"
                  id="major"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
                  placeholder="Teknik Informatika"
                />
              </div>

              <div className="relative">
                <label htmlFor="position_id" className="block text-sm font-semibold text-gray-700 mb-2">
                  Posisi yang Dilamar *
                </label>
                <select
                  id="position_id"
                  name="position_id"
                  value={formData.position_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer transition duration-150 shadow-sm"
                  disabled={positions.length === 0}
                >
                  <option value="" disabled>
                    {positions.length === 0 && !submissionError ? 'Memuat posisi...' : 'Pilih Posisi'}
                  </option>
                  {positions.map((pos) => (
                    // Nilai (value) adalah ID (UUID) yang akan disimpan di Supabase
                    <option key={pos.id} value={pos.id}> 
                      {pos.title}
                    </option>
                  ))}
                </select>
                {/* Visual dropdown arrow tambahan */}
                <div className="absolute right-3 top-[42px] pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* CV URL */}
            <div className="mb-6 relative">
              <label htmlFor="cv_url" className="block text-sm font-semibold text-gray-700 mb-2">
                Link CV / Portfolio *
              </label>
              <Upload className="absolute left-4 top-[48px] transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="url"
                id="cv_url"
                name="cv_url"
                value={formData.cv_url}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
                placeholder="https://drive.google.com/... atau portfolio URL"
              />
            </div>

            {/* Motivasi */}
            <div className="mb-8">
              <label htmlFor="motivation" className="block text-sm font-semibold text-gray-700 mb-2">
                Motivasi *
              </label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition duration-150 shadow-sm"
                placeholder="Ceritakan mengapa Anda tertarik bergabung..."
              />
            </div>

            {/* Tombol kirim */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Mengirim...
                </>
              ) : (
                <>
                  Kirim Aplikasi
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}