"use client";

import { MonthlyPlan } from "@/types/plan";
import { getUser } from "@/lib/auth";

interface MonthlyPlansTableProps {
  rows: MonthlyPlan[];
  onWriteFact: (plan: MonthlyPlan) => void;
}

export default function MonthlyPlansTable({
  rows,
  onWriteFact,
}: MonthlyPlansTableProps) {
  const user = getUser();
  const isAdmin = user?.role === "admin";

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            {isAdmin ? <th className="px-4 py-3 text-left">Manager</th> : null}
            <th className="px-4 py-3 text-left">Oy/Yil</th>
            <th className="px-4 py-3 text-left">Qo‘ng‘iroq</th>
            <th className="px-4 py-3 text-left">Suhbat</th>
            <th className="px-4 py-3 text-left">Sotuv</th>
            <th className="px-4 py-3 text-left">Umumiy kassa</th>
            <th className="px-4 py-3 text-left">Mukofot</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((item) => (
            <tr key={item.id} className="border-t border-slate-100">
              {isAdmin ? (
                <td className="px-4 py-3 whitespace-nowrap">{item.user?.fullName}</td>
              ) : null}
              <td className="px-4 py-3 whitespace-nowrap">
                {item.month}/{item.year}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{item.planCalls}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.planTalks}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.planSalesCount}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {Number(item.planTotalCash).toLocaleString("ru-RU")}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {item.rewardName || "-"}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {!isAdmin ? (
                  <button
                    onClick={() => onWriteFact(item)}
                    className="rounded-lg bg-blue-600 px-3 py-1 text-white"
                  >
                    Fakt yozish
                  </button>
                ) : (
                  <span className="text-slate-400">Ko‘rish</span>
                )}
              </td>
            </tr>
          ))}

          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={isAdmin ? 8 : 7}
                className="px-4 py-10 text-center text-slate-500"
              >
                Oylik plan topilmadi
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}