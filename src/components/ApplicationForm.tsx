import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Send, Upload, CheckCircle } from "lucide-react";
import { supabase } from "../lib/supabase"; 


type Position = {
  id: string; 
  title: string;
};

type FormData = {
  full_name: string;
  email: string;
  phone: string;
  school_university: string;
  major: string;
  position_id: string; 
  cv_url: string;
  motivation: string;
};


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
  const [formData, setFormData] = useState<FormData>(initialFormData);


  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const { data, error } = await supabase
          .from("positions")
          .select("id, title") 
          .eq("is_active", true)
          .order("title", { ascending: true });

        if (error) throw error;
        setPositions(data || []);
      } catch (err) {
     
        console.error("❌ Gagal mengambil data posisi:", (err as Error).message);
      }
    };

    fetchPositions();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

  const payload = { ...formData };
    

    if (!payload.position_id) {
        alert("Mohon pilih posisi yang dilamar.");
        setLoading(false);
        return;
    }

    try {
      const { error } = await supabase
        .from("applications")
        .insert([payload]); 

      if (error) {
          throw new Error(error.message || "Gagal mengirim aplikasi melalui Supabase.");
      }

      setSuccess(true);

      setFormData(initialFormData);

 
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      const errorMessage = err.message || "Terjadi kesalahan yang tidak diketahui.";
      alert("Terjadi kesalahan saat mengirim aplikasi: " + errorMessage);
      console.error("❌ Gagal mengirim aplikasi:", errorMessage, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="application-form" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-4">
              Daftar Sekarang
            </h2>
            <p className="text-xl text-gray-600">
              Lengkapi form di bawah ini dan mulai perjalanan karir digitalmu!
            </p>
          </div>

      
          {success && (
            <div className="mb-8 bg-green-50 border-2 border-green-500 rounded-2xl p-6 flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
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

     
          <form
            onSubmit={handleSubmit}
            className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-3xl p-8 sm:p-10 shadow-xl"
          >
    
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-900"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-900"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2">
                  No. WhatsApp *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-900"
                  placeholder="08123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2">
                  Sekolah / Universitas *
                </label>
                <input
                  type="text"
                  name="school_university"
                  value={formData.school_university}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-900"
                  placeholder="Universitas XYZ"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2">
                  Jurusan *
                </label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-900"
                  placeholder="Teknik Informatika"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-900 mb-2">
                  Posisi yang Dilamar *
                </label>
                <select
                  name="position_id"
                  value={formData.position_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-900 bg-white"
                >
                  <option value="">Pilih Posisi</option>
                  {positions.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      {pos.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-blue-900 mb-2">
                Link CV / Portfolio *
              </label>
              <div className="relative">
                <Upload className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  name="cv_url"
                  value={formData.cv_url}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-900"
                  placeholder="https://drive.google.com/... atau portfolio URL"
                />
              </div>
            </div>

        
            <div className="mb-8">
              <label className="block text-sm font-semibold text-blue-900 mb-2">
                Motivasi *
              </label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-900 resize-none"
                placeholder="Ceritakan mengapa Anda tertarik bergabung..."
              />
            </div>

            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-900 to-blue-800 hover:from-orange-500 hover:to-orange-600 text-white font-bold text-lg py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105"
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