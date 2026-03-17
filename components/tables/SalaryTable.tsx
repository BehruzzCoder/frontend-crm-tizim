import { SalaryAllItem } from "@/types/salary";

interface SalaryTableProps {
  rows: SalaryAllItem[];
}

function moneyFormat(value: number) {
  return Number(value || 0).toLocaleString("ru-RU");
}

export default function SalaryTable({ rows }: SalaryTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-4 py-3 text-left">Manager</th>
            <th className="px-4 py-3 text-left">Foiz</th>
            <th className="px-4 py-3 text-left">Kassa</th>
            <th className="px-4 py-3 text-left">Stavka</th>
            <th className="px-4 py-3 text-left">% Pul</th>
            <th className="px-4 py-3 text-left">Bonus</th>
            <th className="px-4 py-3 text-left">Task bonus</th>
            <th className="px-4 py-3 text-left">Jami</th>
            <th className="px-4 py-3 text-left">Holat</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((item) => (
            <tr key={item.manager.id} className="border-t border-slate-100">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="font-medium text-slate-900">{item.manager.fullName}</div>
                <div className="text-xs text-slate-500">{item.manager.login}</div>
              </td>

              <td className="px-4 py-3 whitespace-nowrap">
                {item.error ? "-" : `${item.overallPercent}%`}
              </td>

              <td className="px-4 py-3 whitespace-nowrap">
                {item.error ? "-" : moneyFormat(Number(item.kassagaTushganPul || 0))}
              </td>

              <td className="px-4 py-3 whitespace-nowrap">
                {item.error ? "-" : `${Number(item.foizStavka || 0) * 100}%`}
              </td>

              <td className="px-4 py-3 whitespace-nowrap">
                {item.error ? "-" : moneyFormat(Number(item.oylikPercentMoney || 0))}
              </td>

              <td className="px-4 py-3 whitespace-nowrap">
                {item.error ? "-" : moneyFormat(Number(item.conversionBonus || 0))}
              </td>

              <td className="px-4 py-3 whitespace-nowrap">
                {item.error ? "-" : moneyFormat(Number(item.monthlyTaskBonus || 0))}
              </td>

              <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-900">
                {item.error ? "-" : moneyFormat(Number(item.jami || 0))}
              </td>

              <td className="px-4 py-3 whitespace-nowrap">
                {item.error ? (
                  <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    {item.error}
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Tayyor
                  </span>
                )}
              </td>
            </tr>
          ))}

          {rows.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-10 text-center text-slate-500">
                Oylik ma’lumot topilmadi
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}