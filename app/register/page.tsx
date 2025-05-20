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
  const [error, setError] = useState('');  const [formData, setFormData] = useState<RegisterForm>({
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

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      setLoading(false);
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
        router.push('/login');
      } else {
        setError(data.message || 'Terjadi kesalahan saat registrasi');
      }    } catch (err: unknown) {
      console.error(err);
      setError('Terjadi kesalahan saat menghubungi server');
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-white flex flex-col justify-center items-center py-12 px-4">
      <HomeButton />
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