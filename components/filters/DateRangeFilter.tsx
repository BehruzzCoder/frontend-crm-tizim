"use client";

import { useState } from "react";

interface Props {
  onApply: (from: string, to: string) => void;
}

export default function DateRangeFilter({ onApply }: Props) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Sana oralig‘i bo‘yicha filter
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-sm text-slate-600">Dan</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-600">Gacha</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => onApply(from, to)}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 text-white"
          >
            Ko‘rsatish
          </button>
        </div>
      </div>
    </div>
  );
}