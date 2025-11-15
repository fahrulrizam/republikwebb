import React, { useState } from 'react';

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    whatsapp: '',
    sekolah: '',
    jurusan: '',
    posisi: '',
    link_cv: '',
    motivasi: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Mengirim...');

    try {
      const response = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Gagal mengirim data');

      const data = await response.json();
      console.log('✅ Berhasil disimpan:', data);
      setStatus('✅ Aplikasi berhasil dikirim!');
      setFormData({
        nama: '',
        email: '',
        whatsapp: '',
        sekolah: '',
        jurusan: '',
        posisi: '',
        link_cv: '',
        motivasi: ''
      });
    } catch (err) {
      console.error('❌ Error:', err);
      setStatus('❌ Gagal mengirim aplikasi');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">Form Aplikasi Magang</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="block text-gray-700 capitalize mb-1">{key.replace('_', ' ')}</label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-900 text-white py-2 px-4 rounded-md w-full hover:bg-blue-800"
        >
          Kirim Aplikasi
        </button>
      </form>
      {status && <p className="mt-4 text-center text-gray-700">{status}</p>}
    </div>
  );
}
