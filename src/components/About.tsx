import { Award, Calendar, Users, Trophy } from 'lucide-react';

export default function About() {
  const benefits = [
    {
      icon: Trophy,
      title: 'Sertifikat Resmi',
      description: 'Dapatkan sertifikat magang yang diakui industri'
    },
    {
      icon: Users,
      title: 'Mentoring Langsung',
      description: 'Bimbingan dari praktisi digital berpengalaman'
    },
    {
      icon: Award,
      title: 'Proyek Real',
      description: 'Terlibat langsung dalam project client nyata'
    },
    {
      icon: Calendar,
      title: 'Fleksibel',
      description: 'Jadwal yang dapat disesuaikan dengan kuliah'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-4">
            Tentang Program Magang
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Program magang 3 bulan yang dirancang khusus untuk mengembangkan skill digital Anda
            dengan pengalaman kerja nyata di industri teknologi
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-orange-50 p-8 rounded-2xl text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-xl mb-4">
                <benefit.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-3xl p-10 sm:p-12 text-white">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold mb-6">Syarat Umum</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">✓</span>
                  <span>Mahasiswa aktif atau fresh graduate (max 1 tahun lulus)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">✓</span>
                  <span>Dapat berkomunikasi dengan baik dalam tim</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">✓</span>
                  <span>Memiliki laptop/komputer pribadi</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">✓</span>
                  <span>Berkomitmen untuk program 3 bulan penuh</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">✓</span>
                  <span>Memiliki passion dan motivasi tinggi untuk belajar</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-3xl font-bold mb-6">Yang Akan Kamu Dapatkan</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">★</span>
                  <span>Pengalaman kerja di agensi digital profesional</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">★</span>
                  <span>Portfolio project nyata untuk career development</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">★</span>
                  <span>Networking dengan profesional industri</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">★</span>
                  <span>Sertifikat magang resmi dari Republikweb</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mt-1">★</span>
                  <span>Peluang karir setelah program berakhir</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
