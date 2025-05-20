'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../components/Input';
import Button from '../components/Button';
import HomeButton from '../components/HomeButton';

interface ProfileData {
  id: string;
  nama_pelanggan: string;
  alamat: string;
  gender: string;
  telepon: string;
  foto?: string; // tambahkan ini
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showLoginToast, setShowLoginToast] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState<ProfileData>({
    id: '',
    nama_pelanggan: '',
    alamat: '',
    gender: '',
    telepon: '',
  });

  useEffect(() => {
    fetchProfile();
    // Cek flag login success dari sessionStorage
    if (typeof window !== 'undefined' && sessionStorage.getItem('loginSuccess') === '1') {
      setShowLoginToast(true);
      sessionStorage.removeItem('loginSuccess');
      setTimeout(() => setShowLoginToast(false), 2000);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('https://learn.smktelkom-mlg.sch.id/ukl1/api/profil');
      const data = await response.json();

      if (data.status) {
        setFormData(data.data);
      } else {
        setError('Gagal mengambil data profil');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghubungi server');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'telepon') {
      // Hanya angka
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validasi telepon minimal 10 dan maksimal 12 angka
    if (formData.telepon.length < 10 || formData.telepon.length > 12) {
      setToast({ type: 'error', message: 'Nomor telepon harus terdiri dari 10 hingga 12 angka' });
      setLoading(false);
      setTimeout(() => setToast(null), 2000);
      return;
    }

    try {
      const response = await fetch('https://learn.smktelkom-mlg.sch.id/ukl1/api/update/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status) {
        setToast({ type: 'success', message: 'Profil berhasil diperbarui' });
        setSuccess('Profil berhasil diperbarui');
        fetchProfile(); // Refresh data profil
        setTimeout(() => setToast(null), 2000);
      } else {
        setToast({ type: 'error', message: data.message || 'Gagal memperbarui profil' });
        setTimeout(() => setToast(null), 2000);
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Terjadi kesalahan saat menghubungi server' });
      setTimeout(() => setToast(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-white flex flex-col items-center py-12 px-4">
      <HomeButton />
      <div className="w-full max-w-xl space-y-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
          <h3 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Profil Pengguna</h3>
          {showLoginToast && (
            <div className="fixed top-20 right-8 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fadeIn font-semibold">
              Login berhasil!
            </div>
          )}
          {toast && (
            <div className={`fixed top-20 right-8 z-50 px-6 py-3 rounded-lg shadow-lg animate-fadeIn font-semibold text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{toast.message}</div>
          )}
          <div className="flex justify-center mb-6">
            <img
              src="/Profile.webp"
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow bg-slate-100"
            />
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nama Lengkap"
              name="nama_pelanggan"
              value={formData.nama_pelanggan}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kelamin <span className="text-red-500">*</span></label>
              <div className="flex space-x-6">
                <label className="inline-flex items-center">
                  <input type="radio" name="gender" value="Laki-laki" checked={formData.gender === 'Laki-laki'} onChange={handleChange} className="form-radio text-indigo-600" required />
                  <span className="text-slate-500 ml-2">Laki-laki</span>
                </label>
                <label className="text-slate-500 inline-flex items-center">
                  <input type="radio" name="gender" value="Perempuan" checked={formData.gender === 'Perempuan'} onChange={handleChange} className="form-radio text-indigo-600" />
                  <span className="ml-2">Perempuan</span>
                </label>
              </div>
            </div>
            <Input
              label="Alamat"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              isTextArea
              required
            />
            <Input
              label="Nomor Telepon"
              name="telepon"
              value={formData.telepon}
              onChange={handleChange}
              required
            />
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="secondary" onClick={() => router.push('/login')} className="bg-slate-200 hover:bg-slate-300 text-slate-700">Keluar</Button>
              <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 