import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Rocket } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Header dianggap "Home Transparan" hanya jika di rute '/' dan TIDAK ada hash
  const isHomePage = location.pathname === '/' && !location.hash; 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    if (location.pathname === '/') {
        // Hanya tambahkan listener scroll jika di halaman utama
        window.addEventListener('scroll', handleScroll);
        // Atur status awal berdasarkan scrollY
        handleScroll(); 
    } else {
        // Jika bukan halaman utama, header harus selalu solid
        setIsScrolled(true);
    }
    
    // Cleanup listener saat komponen unmount atau rute berubah
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]); // Dependensi pada pathname saja (lebih sederhana)

  // Tentukan kelas CSS berdasarkan scroll dan halaman
  const navClass = `fixed w-full z-50 transition-all duration-300 ${
    isScrolled 
      ? 'bg-white shadow-lg py-4'
      : 'bg-transparent py-6'
  }`;
  
  // Tentukan warna teks
  const textColor = isScrolled || location.pathname !== '/' ? 'text-blue-900' : 'text-white';
  const iconColor = isScrolled || location.pathname !== '/' ? 'text-orange-500' : 'text-white';

  const navLinks = [
    // Tautan Internal (Hash Links) - harus ke rute '/' diikuti hash
    { href: '/#about', label: 'Tentang' },
    { href: '/#positions', label: 'Posisi' },
    { href: '/#gallery', label: 'Galeri' },
    { href: '/#testimonials', label: 'Testimoni' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/#contact', label: 'Kontak' },
    // Tautan Halaman Statis
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-of-service', label: 'Terms of Service' }
  ];

  // FUNGSI INTI: Menggabungkan scrolling manual (di Home) dan navigasi Link
  const handleNavLinkClick = (e, href) => {
    setIsOpen(false);
    
    // Periksa apakah ini hash link DAN kita sudah berada di halaman Home
    if (href.startsWith('/#') && location.pathname === '/') {
        e.preventDefault(); // Hentikan navigasi Link default
        
        const hashId = href.substring(2);
        const element = document.getElementById(hashId);
        
        if (element) {
            // Lakukan scrolling manual untuk smooth scroll yang cepat
            element.scrollIntoView({ behavior: 'smooth' });
            
            // Perbarui URL dengan hash tanpa me-reload halaman
            window.history.pushState(null, '', href); 
        }
    } 
    // Jika bukan hash link di Home (yaitu navigasi ke /privacy-policy atau dari /privacy-policy ke /#about), 
    // biarkan Link (to={href}) yang menangani navigasi secara normal.
  };

  return (
    <nav className={navClass}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <Rocket className={`w-8 h-8 ${iconColor}`} />
            <span className={`text-2xl font-bold ${textColor}`}>
              Republikweb
            </span>
          </Link>

          {/* Navigasi Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href} 
                to={link.href} 
                // Gunakan onClick untuk memanggil fungsi custom scroll/navigasi
                onClick={(e) => handleNavLinkClick(e, link.href)}
                className={`font-semibold transition-colors ${
                    // Logika warna teks: Teks Home (hash) menggunakan textColor, teks statis selalu solid.
                    link.href.startsWith('/#') ? textColor : 'text-blue-900'
                } hover:text-orange-500`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Tombol Daftar Sekarang */}
            <Link
              to="/#application-form"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105"
              // Pastikan tombol daftar menggunakan fungsi scrolling manual
              onClick={(e) => handleNavLinkClick(e, '/#application-form')}
            >
              Daftar Sekarang
            </Link>
          </div>

          {/* Tombol Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden ${textColor}`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <div className="flex flex-col gap-4 bg-white rounded-2xl p-6 shadow-xl">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  // Gunakan onClick untuk memanggil fungsi custom scroll/navigasi
                  onClick={(e) => handleNavLinkClick(e, link.href)}
                  className="text-blue-900 hover:text-orange-500 font-semibold transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
              
              <Link
                to="/#application-form"
                onClick={(e) => handleNavLinkClick(e, '/#application-form')}
                className="text-center bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full transition-all duration-300 mt-2"
              >
                Daftar Sekarang
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}