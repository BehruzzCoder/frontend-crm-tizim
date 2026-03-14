"use client";

import ConfirmButton from "@/components/common/ConfirmButton";
import {Lead} from "@/types/lead";

interface Props {
  rows: Lead[];
  onEdit: (row: Lead) => void;
  onDelete: (id: number) => void;
}

export default function LeadStatsTable({ rows, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr className="text-left text-slate-600">
            <th className="px-4 py-3">Sana</th>
            <th className="px-4 py-3">Yangi lid</th>
            <th className="px-4 py-3">Ishga olindi</th>
            <th className="px-4 py-3">Aloqa o‘rnatildi</th>
            <th className="px-4 py-3">Konsultatsiya</th>
            <th className="px-4 py-3">Qiziqish</th>
            <th className="px-4 py-3">Hisob raqam</th>
            <th className="px-4 py-3">Pre-daplata</th>
            <th className="px-4 py-3">To‘liq to‘lov</th>
            <th className="px-4 py-3">Ko‘targan</th>
            <th className="px-4 py-3">Ko‘tarmagan</th>
            <th className="px-4 py-3">Action</th>
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
                <div className="flex flex-col md:flex-row gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-lg bg-amber-500 px-3 py-2 text-white text-xs"
                  >
                    Edit
                  </button>

                  <ConfirmButton
                    onConfirm={() => onDelete(item.id)}
                    className="rounded-lg bg-red-600 px-3 py-2 text-white text-xs"
                    confirmText="Shu statistikani o‘chirmoqchimisiz?"
                  >
                    Delete
                  </ConfirmButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}