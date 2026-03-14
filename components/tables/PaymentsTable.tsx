"use client";

import { Payment } from "@/types/payment";

interface PaymentsTableProps {
  payments: Payment[];
  onEdit: (payment: Payment) => void;
  onDelete: (id: number) => void;
}

export default function PaymentsTable({
  payments,
  onEdit,
  onDelete,
}: PaymentsTableProps) {
  const fileBase = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-4 py-3 text-left">Ism familiya</th>
            <th className="px-4 py-3 text-left">Telefon</th>
            <th className="px-4 py-3 text-left">Manager</th>
            <th className="px-4 py-3 text-left">Patok</th>
            <th className="px-4 py-3 text-left">Tarif</th>
            <th className="px-4 py-3 text-left">To‘lov</th>
            <th className="px-4 py-3 text-left">Qarzdorlik</th>
            <th className="px-4 py-3 text-left">Chek</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((item) => {
            const debtZero = Number(item.debt) === 0;

            return (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="px-4 py-3 whitespace-nowrap">{item.fullName}</td>
                <td className="px-4 py-3 whitespace-nowrap">{item.phone}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {item.manager?.fullName || "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{item.stream}</td>
                <td className="px-4 py-3 whitespace-nowrap">{item.tariff}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {Number(item.amount).toLocaleString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      debtZero
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {Number(item.debt).toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {item.receipt ? (
                    <a
                      href={`${fileBase}/uploads/${encodeURIComponent(item.receipt)}`}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Ko‘rish
                    </a>
                  ) : (
                    <span className="text-slate-400">Yo‘q</span>
                  )}
                </td>
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
              </tr>
            );
          })}

          {payments.length === 0 ? (
            <tr>
              <td
                colSpan={9}
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