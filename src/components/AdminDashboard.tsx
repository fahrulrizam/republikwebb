import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
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
} from 'lucide-react';

type Application = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  school_university: string;
  major: string;
  cv_url: string;
  motivation: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  created_at: string;
  position_id: string;
};

type Position = {
  id: string;
  title: string;
};

export default function AdminDashboard() {
  const [applications, setApplications] = useState<(Application & { position: Position })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected'>(
    'all'
  );
  const [selectedApplication, setSelectedApplication] =
    useState<(Application & { position: Position }) | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`*, position:positions(id, title)`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('❌ Gagal mengambil data aplikasi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

 
  const updateStatus = async (id: string, status: Application['status']) => {
    try {
      const { error } = await supabase.from('applications').update({ status }).eq('id', id);
      if (error) throw error;

      await fetchApplications();
      setSelectedApplication(null);
    } catch (error) {
      console.error('❌ Gagal update status:', error);
      alert('Gagal mengupdate status.');
    }
  };

  const filteredApplications = applications.filter((app) =>
    filter === 'all' ? true : app.status === filter
  );

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    reviewed: applications.filter((a) => a.status === 'reviewed').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  const getStatusColor = (status: Application['status']) => {
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

  const getStatusIcon = (status: Application['status']) => {
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


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Kelola aplikasi magang yang masuk</p>
        </div>

        
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <DashboardCard color="blue" label="Total Aplikasi" value={stats.total} />
          <DashboardCard color="yellow" label="Pending" value={stats.pending} />
          <DashboardCard color="blue" label="Reviewed" value={stats.reviewed} />
          <DashboardCard color="green" label="Accepted" value={stats.accepted} />
          <DashboardCard color="red" label="Rejected" value={stats.rejected} />
        </div>

       
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {(['all', 'pending', 'reviewed', 'accepted', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === status
                    ? 'bg-blue-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

 
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Posisi</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{app.full_name}</td>
                    <td className="py-3 px-4 text-gray-600">{app.position?.title || '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{app.email}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(app.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {getStatusIcon(app.status)}
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedApplication(app)}
                        className="text-blue-900 hover:text-orange-500 font-semibold"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    
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



function DashboardCard({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  const borderColor = {
    blue: 'border-blue-900 text-blue-900',
    yellow: 'border-yellow-500 text-yellow-600',
    green: 'border-green-500 text-green-600',
    red: 'border-red-500 text-red-600',
  }[color];
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border-l-4 ${borderColor}`}>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}


function DetailModal({
  application,
  onClose,
  onUpdate,
}: {
  application: Application & { position: Position };
  onClose: () => void;
  onUpdate: (id: string, status: Application['status']) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-2">{application.full_name}</h2>
            <p className="text-gray-600">{application.position?.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle className="w-8 h-8" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Info label="Email" value={application.email} icon={<Mail />} />
            <Info label="WhatsApp" value={application.phone} icon={<Phone />} />
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
              value={<a href={application.cv_url} target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:text-orange-500 font-semibold">Lihat CV</a>}
              icon={<FileText />}
            />
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-2">Motivasi</div>
            <div className="bg-gray-50 rounded-xl p-4 text-gray-700 leading-relaxed">
              {application.motivation}
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t">
            <Button color="blue" icon={<Eye />} label="Mark as Reviewed" onClick={() => onUpdate(application.id, 'reviewed')} />
            <Button color="green" icon={<CheckCircle />} label="Accept" onClick={() => onUpdate(application.id, 'accepted')} />
            <Button color="red" icon={<XCircle />} label="Reject" onClick={() => onUpdate(application.id, 'rejected')} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, icon }: { label: string; value: any; icon: JSX.Element }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-orange-500 mt-1">{icon}</div>
      <div>
        <div className="text-sm text-gray-600 mb-1">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );
}

function Button({
  color,
  icon,
  label,
  onClick,
}: {
  color: 'blue' | 'green' | 'red';
  icon: JSX.Element;
  label: string;
  onClick: () => void;
}) {
  const bg = {
    blue: 'bg-blue-900 hover:bg-blue-800',
    green: 'bg-green-500 hover:bg-green-600',
    red: 'bg-red-500 hover:bg-red-600',
  }[color];
  return (
    <button
      onClick={onClick}
      className={`flex-1 ${bg} text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2`}
    >
      {icon}
      {label}
    </button>
  );
}
