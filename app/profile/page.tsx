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
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<ProfileData>({
    id: '',
    nama_pelanggan: '',
    alamat: '',
    gender: '',
    telepon: '',
  });

  useEffect(() => {
    fetchProfile();
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

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
        setSuccess('Profil berhasil diperbarui');
        fetchProfile(); // Refresh data profil
      } else {
        setError(data.message || 'Gagal memperbarui profil');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghubungi server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-white flex flex-col justify-center items-center py-12 px-4">
      <HomeButton />
      <div className="w-full max-w-xl space-y-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
          <h3 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Profil Pengguna</h3>
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
            {error && <div className="text-red-500 text-center">{error}</div>}
            {success && <div className="text-green-600 text-center">{success}</div>}
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