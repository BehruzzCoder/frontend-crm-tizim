"use client";

import { Plan } from "@/types/plan";
import { getUser } from "@/lib/auth";

interface PlansTableProps {
  rows: Plan[];
  onEdit: (plan: Plan) => void;
  onDelete: (id: number) => void;
  onFact: (plan: Plan) => void;
  onStatus: (plan: Plan) => void;
  onView: (plan: Plan) => void;
}

export default function PlansTable({
  rows,
  onEdit,
  onDelete,
  onFact,
  onStatus,
  onView,
}: PlansTableProps) {
  const user = getUser();
  const isAdmin = user?.role === "admin";

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-4 py-3 text-left">User</th>
            <th className="px-4 py-3 text-left">Turi</th>
            <th className="px-4 py-3 text-left">Davr</th>
            <th className="px-4 py-3 text-left">Qo‘ng‘iroq plan</th>
            <th className="px-4 py-3 text-left">Qo‘ng‘iroq fact</th>
            <th className="px-4 py-3 text-left">Umumiy foiz</th>
            <th className="px-4 py-3 text-left">Fact holati</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((item) => (
            <tr
              key={item.id}
              className="border-t border-slate-100 hover:bg-slate-50"
            >
              <td className="px-4 py-3 whitespace-nowrap">
                <button
                  onClick={() => onView(item)}
                  className="font-medium text-blue-600 underline"
                >
                  {item.user?.fullName || "-"}
                </button>
              </td>

              <td className="px-4 py-3 whitespace-nowrap capitalize">
                {item.type === "daily"
                  ? "Kunlik"
                  : item.type === "weekly"
                  ? "Haftalik"
                  : "Oylik"}
              </td>

              <td className="px-4 py-3 whitespace-nowrap">
                <button
                  onClick={() => onView(item)}
                  className="text-slate-800 underline"
                >
                  {item.startDate}
                  {item.endDate ? ` - ${item.endDate}` : ""}
                </button>
              </td>

              <td className="px-4 py-3 whitespace-nowrap">{item.planCalls}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {item.factWritten ? item.factCalls : "-"}
              </td>

              <td className="px-4 py-3 whitespace-nowrap">
                {item.factWritten ? (
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      Number(item.overallPercent) >= 100
                        ? "bg-green-100 text-green-700"
                        : Number(item.overallPercent) >= 70
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {Number(item.overallPercent).toFixed(2)}%
                  </span>
                ) : (
                  <span className="text-slate-400">Hisoblanmagan</span>
                )}
              </td>

              <td className="px-4 py-3 whitespace-nowrap">
                {item.factWritten ? (
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Fact yozilgan
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    Fact yozilmagan
                  </span>
                )}
              </td>
    <td className="px-4 py-3 whitespace-nowrap">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onView(item)}
          className="rounded-lg bg-slate-700 px-3 py-1 text-white"
        >
          Ko‘rish
        </button>

        {isAdmin ? (
          <>
            <button
              onClick={() => onEdit(item)}
              className="rounded-lg bg-amber-500 px-3 py-1 text-white"
            >
              Edit
            </button>

            <button
              onClick={() => onStatus(item)}
              className="rounded-lg bg-indigo-600 px-3 py-1 text-white"
            >
              Status
            </button>

            <button
              onClick={() => onDelete(item.id)}
              className="rounded-lg bg-red-600 px-3 py-1 text-white"
            >
              Delete
            </button>
          </>
        ) : !item.factWritten ? (
          <button
            onClick={() => onFact(item)}
            className="rounded-lg bg-blue-600 px-3 py-1 text-white"
          >
            Fact yozish
          </button>
        ) : (
          <span className="rounded-lg bg-slate-100 px-3 py-1 text-slate-500">
            Fact yopilgan
          </span>
        )}
      </div>
    </td>
  </tr>
))}

          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-10 text-center text-slate-500"
              >
                Planlar topilmadi
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}