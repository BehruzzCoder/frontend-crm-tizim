"use client";

interface RatingRow {
  manager: string;
  count: number;
  amount: number;
  debt: number;
}

interface RatingTableProps {
  rows: RatingRow[];
}

export default function RatingTable({ rows }: RatingTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-4 py-3 text-left">O‘rin</th>
            <th className="px-4 py-3 text-left">Manager</th>
            <th className="px-4 py-3 text-left">Sotuvlar soni</th>
            <th className="px-4 py-3 text-left">Jami summa</th>
            <th className="px-4 py-3 text-left">Qarzdorlik</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((item, index) => (
            <tr key={`${item.manager}-${index}`} className="border-t border-slate-100">
              <td className="px-4 py-3 whitespace-nowrap font-semibold">
                #{index + 1}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{item.manager}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.count}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {Number(item.amount).toLocaleString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {Number(item.debt).toLocaleString()}
              </td>
            </tr>
          ))}

          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                Reyting uchun ma’lumot yo‘q
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}