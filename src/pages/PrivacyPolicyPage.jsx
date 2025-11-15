import React from 'react';

/**
 * Komponen Halaman Kebijakan Privasi (Privacy Policy)
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 p-8 pt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 text-blue-900 border-b-4 border-orange-500 pb-2">
          Kebijakan Privasi (Privacy Policy)
        </h1>
        
        <p className="text-sm text-gray-500 mb-8">
          Tanggal Efektif: 12 November 2025
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-blue-800">1. Informasi yang Kami Kumpulkan</h2>
          <p className="mb-4">
            Kami mengumpulkan informasi yang Anda berikan langsung kepada kami, seperti nama, alamat email, nomor WhatsApp, dan detail latar belakang pendidikan/karir saat Anda mendaftar magang atau berlangganan newsletter.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-blue-800">2. Penggunaan Informasi</h2>
          <p className="mb-4">
            Informasi Anda digunakan untuk: (a) Memproses aplikasi magang Anda; (b) Mengirim pembaruan dan newsletter (jika Anda berlangganan); (c) Meningkatkan layanan dan program kami; dan (d) Menghubungi Anda terkait peluang yang relevan.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-blue-800">3. Keamanan Data</h2>
          <p className="mb-4">
            Kami berkomitmen untuk melindungi data pribadi Anda melalui prosedur keamanan teknis dan organisasi yang sesuai untuk mencegah akses, pengungkapan, atau penggunaan yang tidak sah.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-blue-800">4. Perubahan Kebijakan</h2>
          <p>
            Kebijakan Privasi ini dapat diperbarui dari waktu ke waktu. Kami akan memberitahu Anda tentang perubahan signifikan dengan memposting kebijakan baru di halaman ini.
          </p>
        </section>
        
      </div>
    </div>
  );
}