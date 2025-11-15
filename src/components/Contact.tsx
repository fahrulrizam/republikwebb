import { MapPin, Mail, Phone, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-4">
            Hubungi Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Punya pertanyaan? Tim kami siap membantu Anda
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold text-blue-900 mb-6">Informasi Kontak</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Alamat Kantor</h4>
                  <p className="text-gray-600">
                    Jl. Digital No. 123, Yogyakarta<br />
                    Daerah Istimewa Yogyakarta 55281
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Email</h4>
                  <a href="mailto:info@republikweb.net" className="text-orange-500 hover:text-orange-600">
                    info@republikweb.net
                  </a>
                  <br />
                  <a href="mailto:internship@republikweb.net" className="text-orange-500 hover:text-orange-600">
                    internship@republikweb.net
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">WhatsApp</h4>
                  <a href="https://wa.me/6281234567890" className="text-orange-500 hover:text-orange-600">
                    +62 812-3456-7890
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-semibold text-blue-900 mb-4">Ikuti Kami</h4>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/republikweb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-800 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://facebook.com/republikweb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-800 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="https://linkedin.com/company/republikweb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-800 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href="https://twitter.com/republikweb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-800 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-3xl p-8 h-fit">
            <h3 className="text-2xl font-bold text-blue-900 mb-6">Jam Operasional</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-blue-200">
                <span className="font-semibold text-blue-900">Senin - Jumat</span>
                <span className="text-gray-600">08:00 - 17:00 WIB</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-blue-200">
                <span className="font-semibold text-blue-900">Sabtu</span>
                <span className="text-gray-600">09:00 - 15:00 WIB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-blue-900">Minggu</span>
                <span className="text-gray-600">Tutup</span>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white rounded-2xl">
              <h4 className="font-semibold text-blue-900 mb-3">Lokasi Kami</h4>
              <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.0396891517344!2d110.36479931477934!3d-7.778615894384405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59bd3a29b287%3A0x3027a76e352be200!2sYogyakarta%2C%20Special%20Region%20of%20Yogyakarta!5e0!3m2!1sen!2sid!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
