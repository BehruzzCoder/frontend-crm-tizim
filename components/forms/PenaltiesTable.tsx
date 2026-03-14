"use client";

import { Penalty } from "@/types/penalty";
import { getUser } from "@/lib/auth";

interface PenaltiesTableProps {
  rows: Penalty[];
  onEdit: (item: Penalty) => void;
  onDelete: (id: number) => void;
}

export default function PenaltiesTable({
  rows,
  onEdit,
  onDelete,
}: PenaltiesTableProps) {
  const user = getUser();
  const isAdmin = user?.role === "admin";

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            {isAdmin ? <th className="px-4 py-3 text-left">Manager</th> : null}
            <th className="px-4 py-3 text-left">Sana</th>
            <th className="px-4 py-3 text-left">Sabab</th>
            <th className="px-4 py-3 text-left">Turi</th>
            <th className="px-4 py-3 text-left">Summa</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Izoh</th>
            {isAdmin ? <th className="px-4 py-3 text-left">Action</th> : null}
          </tr>
        </thead>

        <tbody>
          {rows.map((item) => (
            <tr key={item.id} className="border-t border-slate-100">
              {isAdmin ? (
                <td className="px-4 py-3 whitespace-nowrap">
                  {item.user?.fullName}
                </td>
              ) : null}
              <td className="px-4 py-3 whitespace-nowrap">{item.penaltyDate}</td>
              <td className="px-4 py-3">{item.reason}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.reasonType}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {Number(item.amount).toLocaleString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{item.status}</td>
              <td className="px-4 py-3">{item.adminComment || "-"}</td>
              {isAdmin ? (
                <td className="px-4 py-3 whitespace-nowrap">
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
              ) : null}
            </tr>
          ))}

          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={isAdmin ? 8 : 6}
                className="px-4 py-10 text-center text-slate-500"
              >
                So‘z narxlari topilmadi
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}