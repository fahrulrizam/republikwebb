import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Admin from './pages/Admin';
// --- Import Komponen Halaman Baru ---
import TermsOfServicePage from './pages/TermsOfServicePage'; 
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

function App() {
  // Komponen Layout Sederhana untuk membungakus halaman yang tidak memiliki Navbar/Footer
  const SimpleLayout = ({ children }) => (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
            {children}
        </main>
        <Footer />
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        
        {/* Route Halaman Utama (Home) */}
        <Route path="/" element={
          <SimpleLayout>
            <Home />
          </SimpleLayout>
        } />
        
        {/* Route Halaman Admin (Biasanya tanpa Navbar/Footer) */}
        <Route path="/admin" element={<Admin />} />
        
        {/* --- ROUTE BARU UNTUK TERMS DAN PRIVACY (Lansung Dapat Diakses) --- */}
        
        <Route 
            path="/terms-of-service" 
            element={
                <SimpleLayout>
                    <TermsOfServicePage />
                </SimpleLayout>
            } 
        />
        
        <Route 
            path="/privacy-policy" 
            element={
                <SimpleLayout>
                    <PrivacyPolicyPage />
                </SimpleLayout>
            } 
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;