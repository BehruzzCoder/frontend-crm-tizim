"use client";

import { Lead } from "@/types/lead";

interface LeadsTableProps {
  rows: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: number) => void;
}

export default function LeadsTable({
  rows,
  onEdit,
  onDelete,
}: LeadsTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-4 py-3 text-left">Sana</th>
            <th className="px-4 py-3 text-left">Yangi lid</th>
            <th className="px-4 py-3 text-left">Ishga olindi</th>
            <th className="px-4 py-3 text-left">Aloqa</th>
            <th className="px-4 py-3 text-left">Konsultatsiya</th>
            <th className="px-4 py-3 text-left">Qiziqish</th>
            <th className="px-4 py-3 text-left">Hisob</th>
            <th className="px-4 py-3 text-left">Pre</th>
            <th className="px-4 py-3 text-left">To‘liq</th>
            <th className="px-4 py-3 text-left">Ko‘targan</th>
            <th className="px-4 py-3 text-left">Ko‘tarmagan</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((item) => (
            <tr key={item.id} className="border-t border-slate-100">
              <td className="px-4 py-3 whitespace-nowrap">{item.date}</td>
              <td className="px-4 py-3">{item.yangiLid}</td>
              <td className="px-4 py-3">{item.ishgaOlindi}</td>
              <td className="px-4 py-3">{item.aloqaOrnatildi}</td>
              <td className="px-4 py-3">{item.konsultatsiyaBerildi}</td>
              <td className="px-4 py-3">{item.qiziqishBildirdi}</td>
              <td className="px-4 py-3">{item.hisobRaqamYuborildi}</td>
              <td className="px-4 py-3">{item.preDaplata}</td>
              <td className="px-4 py-3">{item.toliqTolov}</td>
              <td className="px-4 py-3">{item.kotargan}</td>
              <td className="px-4 py-3">{item.kotarmagan}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-lg bg-amber-500 px-3 py-1 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="rounded-lg bg-red-600 px-3 py-1 text-white"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={12}
                className="px-4 py-10 text-center text-slate-500"
              >
                Ma’lumot topilmadi
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}