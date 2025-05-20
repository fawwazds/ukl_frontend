import { useRouter } from 'next/navigation';

export default function BackDashboard() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push('/dashboard')}
      className="mt-6 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium shadow transition"
    >
      &larr; Back ke Dashboard UKL
    </button>
  );
} 