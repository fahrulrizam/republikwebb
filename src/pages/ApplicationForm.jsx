import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Send, Upload, CheckCircle, AlertTriangle } from "lucide-react";
// Pastikan path ini benar
import { supabase } from "../lib/supabaseClient.ts"; 

// Pastikan skema type ini sesuai dengan Supabase table applications
type Position = {
  id: string; // Kritis: Ini adalah UUID (varchar atau uuid)
  title: string;
};

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

export default function ApplicationForm() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // State baru untuk penanganan error yang lebih baik
  const [submissionError, setSubmissionError] = useState<string | null>(null); 
  
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    email: "",
    phone: "",
    school_university: "",
    major: "",
    position_id: "",
    cv_url: "",
    motivation: "",
  });

  // --- Ambil daftar posisi dari Supabase ---
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const { data, error } = await supabase
          .from("positions")
          .select("id, title")
          .order("title", { ascending: true });

        if (error) throw error;
        setPositions(data || []);
      } catch (err: any) {
        console.error("❌ Gagal mengambil data posisi:", err.message);
        // Tampilkan pesan kesalahan di UI jika gagal memuat posisi
        setSubmissionError("Gagal memuat daftar posisi. Cek RLS atau koneksi Supabase Anda.");
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

  // --- Kirim form ke SUPABASE (Perbaikan Kritis di sini) ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false); // Reset success
    setSubmissionError(null); // Reset error

    // Payload harus MENGGUNAKAN NAMA KOLOM Supabase
    const payload = {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      school_university: formData.school_university,
      major: formData.major,
      position_id: formData.position_id, // Kritis: Harus berupa UUID Posisi
      cv_url: formData.cv_url,
      motivation: formData.motivation,
      // created_at dan status biasanya sudah ditangani oleh default value di Supabase
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
      // Reset form
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        school_university: "",
        major: "",
        position_id: "",
        cv_url: "",
        motivation: "",
      });

      // Hilangkan pesan sukses setelah 4 detik
      setTimeout(() => setSuccess(false), 4000);
      
    } catch (err: any) {
      console.error("❌ Error Supabase:", err.message);
      // Tampilkan error Supabase yang spesifik ke user
      let errorMessage = "Terjadi kesalahan yang tidak diketahui.";
      if (err.message) {
        // Supabase error messages seringkali sangat informatif
        errorMessage = err.message;
      } else if (err.status === 401 || err.status === 403) {
        // Contoh penanganan jika RLS menolak (walaupun biasanya Supabase client yang menangkap error ini)
        errorMessage = "Aplikasi ditolak. Cek RLS (Row Level Security) di tabel applications.";
      }
      setSubmissionError("Gagal mengirim aplikasi: " + errorMessage); 
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="application-form" className="py-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-blue-900 mb-4 font-inter">
              Daftar Program Magang
            </h2>
            <p className="text-xl text-gray-600">
              Lengkapi form di bawah ini dan mulai perjalanan karir digitalmu!
            </p>
          </div>

          {/* ✅ Pesan sukses */}
          {success && (
            <div className="mb-8 bg-green-50 border-2 border-green-500 rounded-2xl p-6 flex items-start gap-4 shadow-md">
              <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-green-900 text-lg mb-1">
                  Berhasil!
                </h3>
                <p className="text-green-700">
                  Aplikasi Anda telah diterima. Kami akan menghubungi Anda
                  segera!
                </p>
              </div>
            </div>
          )}

          {/* ❌ Pesan Error Supabase */}
          {submissionError && (
            <div className="mb-8 bg-red-50 border-2 border-red-500 rounded-2xl p-6 flex items-start gap-4 shadow-md">
              <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-900 text-lg mb-1">
                  Gagal Mengirim Aplikasi
                </h3>
                <p className="text-red-700 text-sm break-words">
                  Pesan Error: **{submissionError}**
                </p>
                <p className="text-red-700 text-sm mt-2">
                  **Tips:** Cek koneksi Supabase di konsol, dan pastikan
                  **Row Level Security (RLS) INSERT** di tabel `applications` sudah diizinkan untuk peran `anon` (publik).
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition duration-150"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition duration-150"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* WhatsApp & Sekolah */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  No. WhatsApp *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition duration-150"
                  placeholder="08123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sekolah / Universitas *
                </label>
                <input
                  type="text"
                  name="school_university"
                  value={formData.school_university}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition duration-150"
                  placeholder="Universitas XYZ"
                />
              </div>
            </div>

            {/* Jurusan & Posisi */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jurusan *
                </label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition duration-150"
                  placeholder="Teknik Informatika"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Posisi yang Dilamar *
                </label>
                <select
                  name="position_id"
                  value={formData.position_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 bg-white appearance-none cursor-pointer transition duration-150"
                >
                  <option value="" disabled>Pilih Posisi</option>
                  {positions.length === 0 ? (
                    <option disabled>Memuat posisi...</option>
                  ) : (
                    positions.map((pos) => (
                      // Nilai (value) adalah ID (UUID) yang akan disimpan di Supabase
                      <option key={pos.id} value={pos.id}> 
                        {pos.title}
                      </option>
                    ))
                  )}
                </select>
                {/* Visual dropdown arrow tambahan */}
                <div className="absolute right-3 top-[37px] pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* CV URL */}
            <div className="mb-6 relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Link CV / Portfolio *
              </label>
              <Upload className="absolute left-4 top-[50px] transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="url"
                name="cv_url"
                value={formData.cv_url}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition duration-150"
                placeholder="https://drive.google.com/... atau portfolio URL"
              />
            </div>

            {/* Motivasi */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Motivasi *
              </label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 resize-none transition duration-150"
                placeholder="Ceritakan mengapa Anda tertarik bergabung..."
              />
            </div>

            {/* Tombol kirim */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.99]"
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