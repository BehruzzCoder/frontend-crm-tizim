import { UserItem } from "@/types/user";

interface UsersTableProps {
  rows: UserItem[];
  onDelete: (id: number) => void;
}

export default function UsersTable({ rows, onDelete }: UsersTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">F.I.O</th>
            <th className="px-4 py-3 text-left">Login</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((item) => (
            <tr key={item.id} className="border-t border-slate-100">
              <td className="px-4 py-3 whitespace-nowrap">`{item.id}`</td>
              <td className="px-4 py-3 whitespace-nowrap">`{item.fullName}`</td>
              <td className="px-4 py-3 whitespace-nowrap">`{item.login}`</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    item.role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {item.role}
                </span>
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
                colSpan={5}
                className="px-4 py-10 text-center text-slate-500"
              >
                Foydalanuvchilar topilmadi
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}