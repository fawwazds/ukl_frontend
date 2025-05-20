'use client';
import React, { useEffect, useState } from 'react';
import HomeButton from '../components/HomeButton';

interface Matkul {
  id: string;
  nama_matkul: string;
  sks: string | number;
}

export default function MatkulPage() {
  const [matkuls, setMatkuls] = useState<Matkul[]>([]);
  const [selected, setSelected] = useState<{ [id: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState('');
  const [submitted, setSubmitted] = useState<Matkul[] | null>(null);

  useEffect(() => {
    fetch('https://learn.smktelkom-mlg.sch.id/ukl1/api/getmatkul')
      .then(res => res.json())
      .then(data => {
        if (data.status && Array.isArray(data.data)) {
          setMatkuls(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCheck = (id: string) => {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedMatkul = matkuls.filter(m => selected[m.id]);
    if (selectedMatkul.length === 0) {
      setNotif('Pilih minimal satu mata kuliah!');
      setTimeout(() => setNotif(''), 2000);
      return;
    }
    try {
      const response = await fetch('https://learn.smktelkom-mlg.sch.id/ukl1/api/selectmatkul', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ list_matkul: selectedMatkul }),
      });
      const data = await response.json();
      if (data.status) {
        setNotif('Berhasil: ' + data.message);
        setSubmitted(selectedMatkul);
      } else {
        setNotif('Gagal: ' + (data.message || 'Gagal menyimpan pilihan'));
      }
    } catch (err) {
      setNotif('Gagal: Tidak dapat menghubungi server');
    }
    setTimeout(() => setNotif(''), 2500);
  };

  const handleReset = () => {
    setSelected({});
    setSubmitted(null);
    setNotif('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-white flex flex-col items-center py-12 px-4">
      <HomeButton />
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Daftar Mata Kuliah</h2>
        {submitted ? (
          <div className="animate-fadeIn">
            <div className="mb-4 text-green-700 text-center font-semibold">Pilihan berhasil disimpan!</div>
            <div className="mb-4 text-slate-700 text-center">Berikut matkul yang kamu pilih:</div>
            <ul className="space-y-3 mb-6">
              {submitted.map((m) => (
                <li key={m.id} className="flex items-center justify-between bg-indigo-50 rounded-lg px-4 py-3 shadow-sm">
                  <div className="font-semibold text-indigo-700">{m.nama_matkul}</div>
                  <div className="text-slate-500 text-sm">SKS: {m.sks}</div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-slate-200 hover:bg-indigo-100 text-slate-700 font-semibold py-3 rounded-lg shadow transition"
            >
              Pilih Ulang
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow">
              <table className="w-full text-slate-700">
                <thead>
                  <tr className="bg-indigo-50">
                    <th className="py-3 px-2 font-bold text-indigo-700 text-center sticky top-0">ID</th>
                    <th className="py-3 px-2 font-bold text-indigo-700 text-left sticky top-0">Mat Kul</th>
                    <th className="py-3 px-2 font-bold text-indigo-700 text-center sticky top-0">SKS</th>
                    <th className="py-3 px-2 font-bold text-indigo-700 text-center sticky top-0">Pilih</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={4} className="text-center py-6">Loading...</td></tr>
                  ) : (
                    matkuls.map((m, idx) => (
                      <tr
                        key={m.id}
                        className={`transition hover:bg-indigo-50 ${idx === matkuls.length - 1 ? 'rounded-b-xl' : ''}`}
                      >
                        <td className="py-2 px-2 text-center font-semibold">{m.id}</td>
                        <td className="py-2 px-2">{m.nama_matkul}</td>
                        <td className="py-2 px-2 text-center">{m.sks}</td>
                        <td className="py-2 px-2 text-center">
                          <input
                            type="checkbox"
                            checked={!!selected[m.id]}
                            onChange={() => handleCheck(m.id)}
                            className="accent-indigo-600 w-6 h-6 rounded border border-slate-300 focus:ring-2 focus:ring-indigo-300 transition"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <button
              type="submit"
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow transition"
            >
              simpan yang terpilih
            </button>
            {notif && <div className="mt-4 text-center text-sm font-semibold text-green-600 animate-fadeIn">{notif}</div>}
          </form>
        )}
      </div>
    </div>
  );
}