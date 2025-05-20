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
      const response = await fetch('https://learn.smktelkom-mlg.sch.id/ukl1/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status) {
        setSuccess('Login berhasil!');
      } else {
        setError(data.message || 'Username atau password salah');
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
            {error && <div className="text-red-500 text-center">{error}</div>}
            {success && <div className="text-green-600 text-center">{success}</div>}
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