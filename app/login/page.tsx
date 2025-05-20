'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../components/Input';
import Button from '../components/Button';
import HomeButton from '../components/HomeButton';

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<LoginForm>({
    username: '',
    password: '',
  });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.password.length < 8) {
      setToast({ type: 'error', message: 'Password minimal 8 karakter' });
      setLoading(false);
      setTimeout(() => setToast(null), 2000);
      return;
    }

    try {
      const response = await fetch('https://learn.smktelkom-mlg.sch.id/ukl1/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('loginSuccess', '1');
        }
        router.push('/profile');
      } else {
        setToast({ type: 'error', message: data.message || 'Username atau password salah' });
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-white flex flex-col justify-center items-center py-12 px-4">
      <HomeButton />
      {toast && (
        <div className={`fixed top-20 right-8 z-50 px-6 py-3 rounded-lg shadow-lg animate-fadeIn font-semibold text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{toast.message}</div>
      )}
      <div className="w-full max-w-md space-y-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
          <h2 className="text-center text-3xl font-bold text-indigo-700 mb-2">Selamat Datang</h2>
          <p className="text-center text-slate-500 mb-6">Masuk ke akun Anda untuk melanjutkan</p>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Masukkan username Anda"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Masukkan password Anda"
            />
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">{loading ? 'Memproses...' : 'Masuk'}</Button>
          </form>
          <div className="text-center mt-4">
            <span className="text-slate-500">Belum punya akun? </span>
            <button type="button" onClick={() => router.push('/register')} className="text-indigo-600 hover:underline">Daftar di sini</button>
          </div>
        </div>
      </div>
    </div>
  );
} 