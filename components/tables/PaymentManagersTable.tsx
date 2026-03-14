"use client";

import { PaymentByManager } from "@/types/analytics";

interface PaymentManagersTableProps {
  rows: PaymentByManager[];
}

export default function PaymentManagersTable({
  rows,
}: PaymentManagersTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-4 py-3 text-left">Manager</th>
            <th className="px-4 py-3 text-left">To‘lovlar soni</th>
            <th className="px-4 py-3 text-left">Jami summa</th>
            <th className="px-4 py-3 text-left">Jami qarzdorlik</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((item, index) => (
            <tr key={`${item.manager}-${index}`} className="border-t border-slate-100">
              <td className="px-4 py-3 whitespace-nowrap">{item.manager}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.count}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {Number(item.amount).toLocaleString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    Number(item.debt) === 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {Number(item.debt).toLocaleString()}
                </span>
              </td>
            </tr>
          ))}

          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-10 text-center text-slate-500"
              >
                Manager analytics topilmadi
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}