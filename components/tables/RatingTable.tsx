import { RatingItem } from "@/types/rating";

interface RatingTableProps {
  rows: RatingItem[];
}

export default function RatingTable({ rows }: RatingTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-4 py-3 text-left">O‘rin</th>
            <th className="px-4 py-3 text-left">Manager</th>
            <th className="px-4 py-3 text-left">Login</th>
            <th className="px-4 py-3 text-left">Jami kassa</th>
            <th className="px-4 py-3 text-left">Holat</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((item) => (
            <tr key={item.manager.id} className="border-t border-slate-100">
              <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-900">
                #{item.rank}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {item.manager.fullName}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                {item.manager.login}
              </td>
              <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-900">
                {Number(item.totalCash).toLocaleString("ru-RU")}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  ⬆️ Faol
                </span>
              </td>
            </tr>
          ))}

          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-10 text-center text-slate-500"
              >
                Reyting ma’lumoti topilmadi
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}