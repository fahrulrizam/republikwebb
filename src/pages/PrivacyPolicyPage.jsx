import React from 'react';


export default function PrivacyPolicyPage() {
  // Membuat format tanggal Indonesia secara dinamis
  const tanggalSekarang = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8 pt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 text-blue-900 border-b-4 border-orange-500 pb-2">
          Kebijakan Privasi (Privacy Policy)
        </h1>
        
        <p className="text-sm text-gray-500 mb-8 font-medium">
          Tanggal Efektif: {tanggalSekarang}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-blue-800">1. Informasi yang Kami Kumpulkan</h2>
          <p className="mb-4 leading-relaxed">
            Kami mengumpulkan informasi yang Anda berikan langsung kepada kami, seperti nama, alamat email, nomor WhatsApp, dan detail latar belakang pendidikan/karir saat Anda mendaftar magang atau berlangganan newsletter.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-blue-800">2. Penggunaan Informasi</h2>
          <p className="mb-4 leading-relaxed">
            Informasi Anda digunakan untuk: (a) Memproses aplikasi magang Anda; (b) Mengirim pembaruan dan newsletter (jika Anda berlangganan); (c) Meningkatkan layanan dan program kami; dan (d) Menghubungi Anda terkait peluang yang relevan.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-blue-800">3. Keamanan Data</h2>
          <p className="mb-4 leading-relaxed">
            Kami berkomitmen untuk melindungi data pribadi Anda melalui prosedur keamanan teknis dan organisasi yang sesuai untuk mencegah akses, pengungkapan, atau penggunaan yang tidak sah.
          </p>
        </section>

        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-3 text-blue-800">4. Perubahan Kebijakan</h2>
          <p className="leading-relaxed">
            Kebijakan Privasi ini dapat diperbarui dari waktu ke waktu. Kami akan memberitahu Anda tentang perubahan signifikan dengan memposting kebijakan baru di halaman ini.
          </p>
        </section>
        
      </div>
    </div>
  );
}