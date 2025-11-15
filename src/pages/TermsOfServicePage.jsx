import React from 'react';

/**
 * Komponen Halaman Syarat dan Ketentuan (Terms of Service)
 */
export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 p-8 pt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 text-blue-900 border-b-4 border-orange-500 pb-2">
          Syarat dan Ketentuan Layanan (Terms of Service)
        </h1>
        
        <p className="text-sm text-gray-500 mb-8">
          Berlaku Efektif: 12 November 2025
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-blue-800">1. Penerimaan Syarat</h2>
          <p className="mb-4">
            Dengan mengakses atau menggunakan layanan Republikweb, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan semua syarat, Anda tidak diizinkan untuk menggunakan layanan ini.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-blue-800">2. Program Magang</h2>
          <p className="mb-4">
            Program magang (internship) yang ditawarkan oleh Republikweb ditujukan untuk tujuan edukasi dan pengembangan profesional. Ketentuan spesifik terkait durasi, tanggung jawab, dan kriteria evaluasi akan diatur dalam perjanjian terpisah.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-blue-800">3. Batasan Tanggung Jawab</h2>
          <p className="mb-4">
            Republikweb tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan kami.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-blue-800">4. Hubungi Kami</h2>
          <p>
            Untuk pertanyaan atau informasi lebih lanjut mengenai Syarat dan Ketentuan ini, silakan hubungi kami di info@republikweb.net.
          </p>
        </section>
        
      </div>
    </div>
  );
}