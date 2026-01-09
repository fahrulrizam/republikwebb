import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Apakah program magang ini berbayar?',
      answer: 'Program magang di Republikweb adalah 100% GRATIS. Tidak ada biaya pendaftaran atau biaya apapun. Bahkan, Anda akan mendapatkan sertifikat resmi setelah menyelesaikan program.'
    },
    {
      question: 'Berapa lama durasi program magang?',
      answer: 'Durasi program magang adalah 3 bulan. Selama periode ini, Anda akan terlibat dalam project nyata dan mendapatkan bimbingan intensif dari tim kami.'
    },
    {
      question: 'Apakah bisa magang secara remote/online?',
      answer: 'Ya, kami menyediakan opsi magang remote untuk posisi tertentu. Namun, untuk hasil pembelajaran yang maksimal, kami sangat merekomendasikan magang on-site di kantor kami.'
    },
    {
      question: 'Apakah ada jadwal khusus untuk magang?',
      answer: 'Jadwal magang fleksibel dan dapat disesuaikan dengan jadwal kuliah Anda. Umumnya, kami mengharapkan minimal 4-5 hari per minggu (weekdays), 4-6 jam per hari.'
    },
    {
      question: 'Apa saja yang perlu dipersiapkan?',
      answer: 'Anda perlu mempersiapkan: 1) Laptop/komputer pribadi, 2) CV atau portfolio (jika ada), 3) Motivasi dan komitmen tinggi untuk belajar, 4) Skill dasar sesuai posisi yang dilamar.'
    },
    {
      question: 'Apakah akan mendapatkan sertifikat?',
      answer: 'Ya, semua peserta yang menyelesaikan program magang dengan baik akan mendapatkan sertifikat resmi dari Republikweb yang dapat digunakan untuk melengkapi CV Anda.'
    },
    {
      question: 'Kapan periode pendaftaran dibuka?',
      answer: 'Pendaftaran dibuka sepanjang tahun. Namun, kami melakukan seleksi per batch dengan kuota terbatas. Daftar sekarang untuk mendapatkan kesempatan di batch terdekat!'
    },
    {
      question: 'Bagaimana proses seleksinya?',
      answer: 'Proses seleksi meliputi: 1) Review aplikasi dan CV, 2) Interview online/offline, 3) Test skill sesuai posisi (untuk posisi teknis). Kami akan menghubungi kandidat terpilih via email/WhatsApp.'
    },
    {
      question: 'Apakah ada peluang kerja setelah magang?',
      answer: 'Peserta magang yang menunjukkan performa excellent memiliki kesempatan untuk bergabung sebagai tim tetap Republikweb atau mendapat rekomendasi untuk peluang karir lainnya.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-orange-500/10 rounded-2xl mb-4">
            <HelpCircle className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Temukan jawaban untuk pertanyaan umum seputar program magang kami
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-blue-50 transition-colors"
              >
                <span className="font-bold text-blue-900 text-lg pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-orange-500 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-8 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Masih ada pertanyaan lain?</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600 transition-colors"
          >
            Hubungi Kami
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
          </a>
        </div>
      </div>
    </section>
  );
}
