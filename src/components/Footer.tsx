import React, { useState } from 'react';
import { Rocket, Mail, Phone, MapPin } from 'lucide-react';

// --- TYPE DEFINITIONS ---
type FormEvent = React.FormEvent<HTMLFormElement>;
type ChangeEvent = React.ChangeEvent<HTMLInputElement>;


/**
 * Komponen Fungsional untuk Formulir Newsletter
 * Mengirim data ke endpoint /api/register (sesuai dengan server.js terbaru).
 *
 * Catatan: Menggunakan 'Lainnya' untuk posisiMagang diasumsikan sebagai nilai
 * yang valid di dalam ENUM skema MongoDB Anda.
 */
const NewsletterForm = () => { 
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // PERBAIKAN KRITIS: Menggunakan rute yang disepakati untuk registrasi newsletter.
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    // Fungsi yang dipanggil saat form disubmit
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(''); 
        setIsLoading(true);

        // Validasi client-side dasar
        if (!email || !email.includes('@')) {
            setIsError(true);
            setMessage('Mohon masukkan alamat email yang valid.');
            setIsLoading(false);
            return;
        }

        try {
            // DATA HARUS SINKRON dengan skema Application MongoDB (fields required)
            // Menggunakan nilai default untuk field yang tidak relevan dengan newsletter.
            const payload = {
                // Menggunakan nama field yang sesuai dengan server.js Anda.
                emailAktif: email,
                nama: `[NEWSLETTER] ${email}`, // Label khusus di DB
                whatsapp: '0', // Diisi nilai default
                universitasSekolah: 'Umum/Lainnya', // Nilai default yang lebih generik
                jurusan: 'Informasi Umum', // Nilai default yang lebih generik
                // Menggunakan 'Lainnya' sebagai nilai default yang aman untuk ENUM
                posisiMagang: 'Lainnya', 
                linkPortfolio: 'N/A', // Nilai default
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload), 
            });
            
            // --- Logika Penanganan Respons yang Ditingkatkan ---
            let data: any = {};
            try {
                // Mencoba mendapatkan body respons hanya jika header menunjukkan JSON
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    data = await response.json();
                } else if (response.status === 404) {
                    // Jika 404, respons pasti bukan JSON dari rute yang benar
                    throw new Error(`[404] Rute API tidak ditemukan: ${API_URL}`);
                } else {
                    // Respons non-JSON lainnya (misal HTML server error page)
                    throw new Error(`Server merespons dengan status ${response.status} dan bukan JSON.`);
                }
            } catch (jsonError: any) {
                // Menangani error parsing JSON atau error 404 eksplisit
                console.error("Gagal memproses respons server:", jsonError.message);
                if (jsonError.message.includes('404')) {
                     // Error 404 ditangani secara khusus
                     data = { error: jsonError.message + ". Pastikan server berjalan dan rute di server.js adalah '/api/register'." };
                } else {
                     data = { error: jsonError.message || "Terjadi kesalahan saat memproses respons server." };
                }
            }
            // --- Akhir Logika Penanganan Respons ---
            
            if (response.ok || response.status === 201) {
                // Skenario Sukses (Status 200 OK atau 201 Created)
                setIsError(false);
                setMessage("🎉 Berhasil berlangganan! Data Anda telah dicatat di database.");
                setEmail(''); // Kosongkan input setelah sukses
            } else if (response.status === 409) {
                // Skenario Konflik (Email sudah terdaftar - Cek dari server.js)
                setIsError(true);
                setMessage(data.error || "Email ini sudah terdaftar. Tidak perlu subscribe lagi.");
            } else if (response.status === 400 && data.error && data.error.includes('enum value')) {
                // Penanganan Error Validasi ENUM posisiMagang
                setIsError(true);
                setMessage(`Gagal: Posisi magang tidak valid. Harap periksa skema database Anda. (Mungkin: ${data.error})`);
            } else {
                // Skenario Gagal Lainnya (400 Bad Request, 500 Internal Server Error, dll.)
                setIsError(true);
                setMessage(data.error || `Gagal berlangganan (Status: ${response.status}). Silakan coba lagi.`);
            }
            
        } catch (error) {
            // Skenario Error Koneksi Jaringan atau Error Try-Catch
            console.error('Submission error:', error);
            setIsError(true);
            // Pesan ini muncul jika koneksi HTTP gagal total (misal server mati)
            setMessage("Koneksi jaringan terputus atau server tidak merespon. Pastikan Server Node.js Anda berjalan.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold mb-5 border-b-2 border-orange-500 pb-1 inline-block">Newsletter</h3>
            
            {/* Kotak Pesan Feedback */}
            {message && (
                <div 
                    className={`p-3 rounded-xl text-white text-sm font-medium transition-all duration-300 ${isError ? 'bg-red-700 border border-red-500 shadow-xl' : 'bg-green-700 border border-green-500 shadow-xl'}`}
                    role="alert"
                >
                    {message}
                </div>
            )}

            <p className="text-blue-300 text-sm mb-4">
              Subscribe untuk mendapatkan update terbaru tentang program magang dan tips karir digital.
            </p>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="email"
                    placeholder="Email Anda"
                    value={email}
                    onChange={(e: ChangeEvent) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 rounded-xl bg-blue-800 border border-blue-700 text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Email subscription"
                />
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center disabled:bg-gray-500 disabled:cursor-not-allowed"
                    aria-label="Subscribe"
                >
                    {/* Loading Spinner saat isLoading true */}
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <Mail className="w-5 h-5" />
                    )}
                </button>
            </form>
        </div>
    );
};
// END NewsletterForm

// Komponen utama: Footer
export default function Footer() {
    const currentYear = new Date().getFullYear();
    
    // URL untuk Policy dan Terms
    const PRIVACY_POLICY_URL = "/privacy-policy";
    const TERMS_OF_SERVICE_URL = "/terms-of-service";

    // PENTING: Gunakan href yang sesuai dengan ID section di halaman Anda
    const navLinks = [
        { href: "#about", label: "Tentang Program" },
        { href: "#positions", label: "Posisi Tersedia" },
        { href: "#gallery", label: "Galeri" },
        { href: "#testimonials", label: "Testimonial" },
        { href: "#faq", label: "FAQ" },
    ];


    return (
        <footer className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white rounded-t-xl shadow-2xl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-8">
                    
                    {/* Kolom 1: Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Rocket className="w-8 h-8 text-orange-400" />
                            <span className="text-3xl font-extrabold tracking-tight">Republikweb</span>
                        </div>
                        <p className="text-blue-200 leading-relaxed text-sm">
                            Agensi digital yang fokus pada **website development**, **app creation**, dan **SEO services**. 
                            Membangun karir digital Anda bersama kami dengan semangat inovasi dan kolaborasi.
                        </p>
                    </div>

                    {/* Kolom 2: Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-5 border-b-2 border-orange-500 pb-1 inline-block">Quick Links</h3>
                        <ul className="space-y-3">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <a href={link.href} className="text-blue-300 hover:text-orange-400 transition-all text-sm block transform hover:translate-x-1">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kolom 3: Kontak */}
                    <div>
                        <h3 className="text-xl font-bold mb-5 border-b-2 border-orange-500 pb-1 inline-block">Kontak</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                                <span className="text-blue-300 text-sm">
                                    Jl. Digital No. 123, Blok A-10<br />Yogyakarta 55281, Indonesia
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-orange-400 flex-shrink-0" />
                                <a href="mailto:info@republikweb.net" className="text-blue-300 hover:text-orange-400 transition-colors text-sm">
                                    info@republikweb.net
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-orange-400 flex-shrink-0" />
                                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-orange-400 transition-colors text-sm">
                                    +62 812-3456-7890
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Kolom 4: Newsletter */}
                    <div>
                        <NewsletterForm />
                    </div>

                </div>

                {/* Footer Bottom */}
                <div className="border-t border-blue-700/50 pt-8 mt-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-blue-300 text-xs text-center md:text-left font-light">
                            &copy; {currentYear} Republikweb.net. All rights reserved. Built with passion in Yogyakarta.
                        </p>
                        <div className="flex gap-8 text-sm">
                            <a href={PRIVACY_POLICY_URL} className="text-blue-300 hover:text-orange-400 transition-colors text-xs font-light">
                                Privacy Policy
                            </a>
                            <a href={TERMS_OF_SERVICE_URL} className="text-blue-300 hover:text-orange-400 transition-colors text-xs font-light">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}