import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AdminDashboard from '../components/AdminDashboard';
import { Lock, LogOut } from 'lucide-react';

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ✅ Cek session aktif saat pertama kali
  useEffect(() => {
    checkSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    setLoading(false);
  };

  // ✅ Fungsi login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Coba login Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Cek apakah user ini adalah admin dari tabel "admin_users"
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', data.user?.id)
        .maybeSingle();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        throw new Error('Akses ditolak. Anda bukan admin.');
      }

      setSession(data.session);
    } catch (err: any) {
      setError(err.message || 'Login gagal. Periksa email atau password Anda.');
    }
  };

  // ✅ Fungsi logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate('/');
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  // ✅ Halaman Login
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
        <div className="bg-white rounded-3xl p-10 shadow-2xl w-full max-w-md">
          {/* Header Login */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-2xl mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Masuk untuk mengakses dashboard admin</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-500 text-red-700 rounded-xl p-4 text-center">
              {error}
            </div>
          )}

          {/* Form Login */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-blue-900 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-900 focus:outline-none transition-colors"
                placeholder="admin@republikweb.net"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-blue-900 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-900 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-900 to-blue-800 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Login
            </button>
          </form>

          {/* Tombol kembali */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-blue-900 text-sm"
            >
              ← Kembali ke Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Halaman Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-900 hover:text-orange-500 font-semibold"
          >
            ← Kembali ke Website
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard Admin */}
      <AdminDashboard />
    </div>
  );
}
