'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../components/Input';
import Button from '../components/Button';
import HomeButton from '../components/HomeButton';

interface RegisterForm {
  nama_nasabah: string;
  gender: string;
  alamat: string;
  telepon: string;
  username: string;
  password: string;
  confirmPassword: string;
  foto: File | null;
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState<RegisterForm>({
    nama_nasabah: '',
    gender: '',
    alamat: '',
    telepon: '',
    username: '',
    password: '',
    confirmPassword: '',
    foto: null,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // For telepon field, allow only numeric input
    if (name === 'telepon') {
      // Remove any non-numeric characters
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, foto: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validasi telepon minimal 10 dan maksimal 12 angka
    if (formData.telepon.length < 10 || formData.telepon.length > 12) {
      setToast({ type: 'error', message: 'Nomor telepon harus terdiri dari 10 hingga 12 angka' });
      setLoading(false);
      setTimeout(() => setToast(null), 2000);
      return;
    }

    // Validasi password minimal 8 karakter
    if (formData.password.length < 8) {
      setToast({ type: 'error', message: 'Password minimal 8 karakter' });
      setLoading(false);
      setTimeout(() => setToast(null), 2000);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setToast({ type: 'error', message: 'Password dan konfirmasi password tidak cocok' });
      setLoading(false);
      setTimeout(() => setToast(null), 2000);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch('https://learn.smktelkom-mlg.sch.id/ukl1/api/register', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.status) {
        setToast({ type: 'success', message: 'Registrasi berhasil! Mengalihkan ke halaman login...' });
        setTimeout(() => {
          setToast(null);
          router.push('/login');
        }, 2000);
      } else {
        setToast({ type: 'error', message: data.message || 'Terjadi kesalahan saat registrasi' });
        setTimeout(() => setToast(null), 2000);
      }
    } catch (err: unknown) {
      console.error(err);
      setToast({ type: 'error', message: 'Terjadi kesalahan saat menghubungi server' });
      setTimeout(() => setToast(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-white flex flex-col justify-center items-center py-12 px-4">
      <HomeButton />
      {toast && (
        <div className={`fixed top-20 right-8 z-50 px-6 py-3 rounded-lg shadow-lg animate-fadeIn font-semibold text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{toast.message}</div>
      )}
      <div className="w-full max-w-xl space-y-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
          <h2 className="text-center text-3xl font-bold text-indigo-700 mb-2">Daftar Akun Baru</h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Nama Lengkap"
              name="nama_nasabah"
              value={formData.nama_nasabah}
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
                <label className="inline-flex items-center">
                  <input type="radio" name="gender" value="Perempuan" checked={formData.gender === 'Perempuan'} onChange={handleChange} className="form-radio text-indigo-600" />
                  <span className="text-slate-500 ml-2">Perempuan</span>
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
            />            <Input
              label="Nomor Telepon"
              name="telepon"
              type='tel'
              value={formData.telepon}
              onChange={handleChange}
              required
              pattern="[0-9]*"
            />
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Input
              label="Konfirmasi Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Foto Profil <span className="text-red-500">*</span></label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" required />
            </div>
            {error && <div className="text-red-500 text-center">{error}</div>}
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">{loading ? 'Mendaftar...' : 'Daftar'}</Button>
            <div className="text-center mt-4">
              <span className="text-slate-500">Sudah punya akun? </span>
              <button type="button" onClick={() => router.push('/login')} className="text-indigo-600 hover:underline">Masuk di sini</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 