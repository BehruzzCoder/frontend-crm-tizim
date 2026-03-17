"use client";

import { Payment } from "@/types/payment";

interface PaymentsTableProps {
  rows: Payment[];
  onDelete: (id: number) => void;
  onGiveBonus: (id: number) => void;
}

export default function PaymentsTable({
  rows,
  onDelete,
  onGiveBonus,
}: PaymentsTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-4 py-3 text-left">Manager</th>
            <th className="px-4 py-3 text-left">Mijoz</th>
            <th className="px-4 py-3 text-left">Telefon</th>
            <th className="px-4 py-3 text-left">Tarif</th>
            <th className="px-4 py-3 text-left">To‘lov turi</th>
            <th className="px-4 py-3 text-left">To‘lov</th>
            <th className="px-4 py-3 text-left">Shartnoma</th>
            <th className="px-4 py-3 text-left">Qarzdorlik</th>
            <th className="px-4 py-3 text-left">Bonus</th>
            <th className="px-4 py-3 text-left">Sana</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((item) => (
            <tr key={item.id} className="border-t border-slate-100">
              <td className="px-4 py-3 whitespace-nowrap">
                {item.manager?.fullName || "-"}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{item.clientName}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.phone}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.tariff}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.paymentType}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {Number(item.amount).toLocaleString("ru-RU")}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {Number(item.contractAmount).toLocaleString("ru-RU")}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {Number(item.debt).toLocaleString("ru-RU")}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {item.bonusGiven ? (
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Berilgan
                  </span>
                ) : (
                  <button
                    onClick={() => onGiveBonus(item.id)}
                    className="rounded-lg bg-indigo-600 px-3 py-1 text-white"
                  >
                    Bonus berish
                  </button>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {new Date(item.createdAt).toLocaleDateString("ru-RU")}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <button
                  onClick={() => onDelete(item.id)}
                  className="rounded-lg bg-red-600 px-3 py-1 text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={11}
                className="px-4 py-10 text-center text-slate-500"
              >
                To‘lovlar topilmadi
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}