import { useEffect, useState, useMemo } from 'react';
// Mengganti import Firebase dengan Supabase
// Path ini diambil dari AdminDashboard.jsx sebelumnya, mengasumsikan file client Supabase tersedia di sana.
import { supabase } from '../lib/supabaseClient'; 

import {
  FileText,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';

// --- DEFINISI TYPE UNTUK KEBERSIHAN KODE ---
const APPLICATION_STATUSES = ['pending', 'reviewed', 'accepted', 'rejected'] as const;
type ApplicationStatus = typeof APPLICATION_STATUSES[number];

type Position = {
  id: string;
  title: string;
};

type Application = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  school_university: string;
  major: string;
  cv_url: string;
  motivation: string;
  status: ApplicationStatus;
  created_at: string; // Store as ISO string
  position_id: string;
  // Ini digunakan untuk hasil JOIN Supabase
  position?: Position | Position[] | null; 
};

// Gabungan Application dan Position untuk tampilan
type FullApplication = (Application & { position: Position | null });

// --- FUNGSI HELPER ---

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function AdminDashboard() {
  // Menghapus state Firebase/Firestore
  // State Aplikasi
  const [applications, setApplications] = useState<FullApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | ApplicationStatus>('all');
  const [selectedApplication, setSelectedApplication] = useState<FullApplication | null>(null);
  const [errorNotification, setErrorNotification] = useState<string | null>(null);

  // --- 1. AMBIL DATA DARI SUPABASE ---
  const fetchApplications = async () => {
    setLoading(true);
    setErrorNotification(null); // Reset error saat fetch baru
    try {
      // Mengambil relasi Foreign Key dari tabel 'positions' dan meng-alias-nya menjadi 'position'
      const { data, error } = await supabase
        .from('applications')
        .select(`
            *, 
            position:position_id(id, title) // JOIN ke tabel 'positions'
        `) 
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Memetakan data yang masuk untuk menyederhanakan struktur relasi
      const mappedData = (data || []).map(item => {
        // Supabase mengembalikan relasi 1:1 sebagai objek tunggal jika tidak ada JOIN lain.
        const positionDetail = Array.isArray(item.position) 
            ? item.position[0] 
            : item.position;

        return {
            ...item,
            // Menyatukan properti 'position' yang sudah di-JOIN
            position: positionDetail || null,
        } as FullApplication;
      });
      
      setApplications(mappedData);

    } catch (error) {
      console.error('❌ Gagal mengambil data aplikasi:', error);
      // Notifikasi error yang lebih jelas
      setErrorNotification(`Gagal mengambil data aplikasi: ${(error as Error).message}. Cek RLS dan koneksi Supabase Anda.`);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // Memuat data Supabase saat inisialisasi
    fetchApplications();
    // Jika Anda ingin Realtime, Anda perlu menambahkan Subscriptions Supabase di sini.
  }, []);

  // --- Update status aplikasi (Supabase) ---
  const updateStatus = async (id: string, status: ApplicationStatus) => {
    try {
      // Update dokumen di Supabase
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Refresh data setelah update
      await fetchApplications(); 

      // Perbarui status pada modal jika masih terbuka
      if (selectedApplication?.id === id) {
        setSelectedApplication(prev => prev ? ({ ...prev, status }) : null);
      }
      
    } catch (error) {
      console.error('❌ Gagal update status:', error);
      setErrorNotification('Gagal mengupdate status aplikasi. Silakan coba lagi. Cek RLS UPDATE.');
    }
  };

  // --- Filter data ---
  const filteredApplications = useMemo(() => {
    return applications.filter((app) =>
      filter === 'all' ? true : app.status === filter
    );
  }, [applications, filter]);


  const stats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    reviewed: applications.filter((a) => a.status === 'reviewed').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  }), [applications]);

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'reviewed':
        return <Eye className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
    }
  };

  // --- UI Loading ---
  if (loading) { 
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-900 mb-4"></div>
        <p className='text-blue-900 font-semibold'>Memuat data dari Supabase...</p>
      </div>
    );
  }

  // --- UI Dashboard ---
  return (
    <div className="min-h-screen bg-gray-50 py-12 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- Notifikasi Error Kustom --- */}
        {errorNotification && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-8 flex items-center gap-3 shadow-md" role="alert">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span className="block sm:inline">{errorNotification}</span>
            <button onClick={() => setErrorNotification(null)} className="ml-auto text-red-700 hover:text-red-900 p-1 rounded-full hover:bg-red-200 transition-colors">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Kelola aplikasi magang yang masuk.</p>
        </div>

        {/* --- Statistik --- */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          <DashboardCard color="blue" label="Total Aplikasi" value={stats.total} />
          <DashboardCard color="yellow" label="Pending" value={stats.pending} />
          <DashboardCard color="indigo" label="Reviewed" value={stats.reviewed} />
          <DashboardCard color="green" label="Accepted" value={stats.accepted} />
          <DashboardCard color="red" label="Rejected" value={stats.rejected} />
        </div>

        {/* --- Filter & Tabel --- */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">
          <div className="flex flex-wrap gap-3 mb-6">
            {(['all', ...APPLICATION_STATUSES] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all shadow-sm ${
                  filter === status
                    ? 'bg-blue-900 text-white shadow-blue-900/40'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({status === 'all' ? applications.length : applications.filter(a => a.status === status).length})
              </button>
            ))}
          </div>

          {/* --- Tabel --- */}
          {filteredApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="text-left py-3 px-4 font-bold text-gray-700 text-sm">Nama</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-700 text-sm">Posisi</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-700 text-sm hidden sm:table-cell">Email</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-700 text-sm hidden md:table-cell">Tanggal</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-700 text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-700 text-sm">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{app.full_name}</td>
                      <td className="py-3 px-4 text-gray-600">{app.position?.title || '-'}</td>
                      <td className="py-3 px-4 text-gray-600 hidden sm:table-cell truncate max-w-xs">{app.email}</td>
                      <td className="py-3 px-4 text-gray-600 hidden md:table-cell whitespace-nowrap">
                        {formatDate(app.created_at)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {getStatusIcon(app.status)}
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="text-blue-900 hover:text-orange-500 font-semibold text-sm transition-colors p-1 rounded-md"
                        >
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
                Tidak ada aplikasi yang ditemukan dengan status "{filter === 'all' ? 'Semua' : filter}".
            </div>
          )}
        </div>
      </div>

      {/* --- Modal Detail --- */}
      {selectedApplication && (
        <DetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onUpdate={updateStatus}
        />
      )}
    </div>
  );
}

// --- Komponen tambahan kecil ---

function DashboardCard({
  color,
  label,
  value,
}: {
  color: 'blue' | 'yellow' | 'green' | 'red' | 'indigo';
  label: string;
  value: number;
}) {
  const colorMap = {
    blue: 'border-blue-500 text-blue-900 bg-blue-50',
    yellow: 'border-yellow-500 text-yellow-700 bg-yellow-50',
    indigo: 'border-indigo-500 text-indigo-700 bg-indigo-50',
    green: 'border-green-500 text-green-700 bg-green-50',
    red: 'border-red-500 text-red-700 bg-red-50',
  };
  const cardStyle = colorMap[color];
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-md border-l-4 ${cardStyle}`}>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-gray-600 text-sm">{label}</div>
    </div>
  );
}

// --- Modal detail aplikasi ---
function DetailModal({
  application,
  onClose,
  onUpdate,
}: {
  application: FullApplication;
  onClose: () => void;
  onUpdate: (id: string, status: ApplicationStatus) => void;
}) {
    const isPending = application.status === 'pending';
    const isReviewed = application.status === 'reviewed';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto p-6 md:p-10 shadow-2xl transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-1">{application.full_name}</h2>
            <p className="text-gray-600 font-medium text-lg">{application.position?.title || 'Posisi Tidak Ditemukan'}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <XCircle className="w-8 h-8" />
          </button>
        </div>

        <div className="space-y-8">
          <div className="grid sm:grid-cols-2 gap-6 p-4 border rounded-2xl bg-gray-50">
            <Info label="Email" value={application.email} icon={<Mail />} />
            <Info label="Telepon" value={application.phone} icon={<Phone />} />
            <Info label="Sekolah/Universitas" value={application.school_university} icon={<GraduationCap />} />
            <Info label="Jurusan" value={application.major} icon={<GraduationCap />} />
            <Info
              label="Tanggal Apply"
              value={new Date(application.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              icon={<Calendar />}
            />
            <Info
              label="CV/Portfolio"
              value={<a href={application.cv_url} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-blue-900 font-semibold truncate block max-w-full underline transition-colors">Lihat CV &rarr;</a>}
              icon={<FileText />}
            />
          </div>

          <div>
            <div className="text-lg font-semibold text-blue-900 mb-3">Motivasi & Pengalaman</div>
            <div className="bg-white border rounded-2xl p-6 text-gray-700 leading-relaxed whitespace-pre-wrap shadow-inner">
              {application.motivation}
            </div>
          </div>

          <div className="pt-6 border-t-2 border-dashed border-gray-200">
            <div className="text-lg font-semibold text-blue-900 mb-4">Ubah Status Aplikasi</div>
            <div className='flex flex-col sm:flex-row gap-3'>
              <Button 
                color="indigo" 
                icon={<Eye />} 
                label="Mark as Reviewed" 
                onClick={() => onUpdate(application.id, 'reviewed')} 
                disabled={!isPending && !isReviewed}
                currentStatus={application.status}
                targetStatus='reviewed'
              />
              <Button 
                color="green" 
                icon={<CheckCircle />} 
                label="Accept" 
                onClick={() => onUpdate(application.id, 'accepted')} 
                disabled={application.status === 'accepted'}
                currentStatus={application.status}
                targetStatus='accepted'
              />
              <Button 
                color="red" 
                icon={<XCircle />} 
                label="Reject" 
                onClick={() => onUpdate(application.id, 'rejected')} 
                disabled={application.status === 'rejected'}
                currentStatus={application.status}
                targetStatus='rejected'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, icon }: { label: string; value: any; icon: JSX.Element }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-orange-500 mt-1 flex-shrink-0">{icon}</div>
      <div className='min-w-0'>
        <div className="text-sm text-gray-600 mb-1">{label}</div>
        <div className="font-semibold text-gray-800 break-words">{value}</div>
      </div>
    </div>
  );
}

function Button({
  color,
  icon,
  label,
  onClick,
  disabled,
  currentStatus,
  targetStatus
}: {
  color: 'indigo' | 'green' | 'red';
  icon: JSX.Element;
  label: string;
  onClick: () => void;
  disabled: boolean;
  currentStatus: ApplicationStatus;
  targetStatus: ApplicationStatus;
}) {
  const baseStyle = 'flex-1 font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed';
  
  const bg = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/50',
    green: 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/50',
    red: 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/50',
  }[color];

  const isActive = currentStatus === targetStatus;
  const activeStyle = isActive ? 'ring-4 ring-offset-2 ring-orange-400 !bg-orange-500 hover:!bg-orange-600' : bg;
  
  return (
    <button
      onClick={onClick}
      disabled={disabled && !isActive}
      className={`${baseStyle} ${activeStyle}`}
    >
      {icon}
      {label}
      {isActive && <CheckCircle className='w-4 h-4 ml-1' />}
    </button>
  );
}