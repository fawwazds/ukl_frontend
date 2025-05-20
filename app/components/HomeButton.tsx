import { useRouter } from 'next/navigation';

export default function HomeButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push('/dashboard')}
      className="fixed top-6 right-6 z-50 bg-white rounded-full shadow-lg p-3 hover:bg-indigo-100 transition flex items-center justify-center border border-slate-200"
      aria-label="Kembali ke Dashboard"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#6366f1" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-7 9 7M4.5 10.5V19a1.5 1.5 0 001.5 1.5h3.75m6 0H18a1.5 1.5 0 001.5-1.5v-8.5M9.75 21V15h4.5v6" />
      </svg>
    </button>
  );
} 