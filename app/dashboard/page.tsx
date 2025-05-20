'use client';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-sky-100 to-white px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md animate-fadeIn">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Tugas UKL 2025 | Fawwaz Damai Saputra</h1>
        <ul className="space-y-4">
          <li>
            <button onClick={() => router.push('/register')} className="w-full text-left px-4 py-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium transition">Tugas 1: Register</button>
          </li>
          <li>
            <button onClick={() => router.push('/login')} className="w-full text-left px-4 py-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium transition">Tugas 2: Login</button>
          </li>
          <li>
            <button onClick={() => router.push('/profile')} className="w-full text-left px-4 py-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium transition">Tugas 3: Profile</button>
          </li>
          <li>
            <button onClick={() => router.push('/matkul')} className="w-full text-left px-4 py-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium transition">Tugas 4: Mata Kuliah</button>
          </li>
        </ul>
      </div>
    </div>
  );
} 