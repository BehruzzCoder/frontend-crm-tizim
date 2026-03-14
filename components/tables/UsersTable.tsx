"use client";

import { AuthUser } from "@/types/user";

type TableUser = AuthUser & {
  phone?: string;
  image?: string | null;
  isActive?: boolean;
  customStartTime?: string | null;
};

interface UsersTableProps {
  rows: TableUser[];
  onEdit: (user: TableUser) => void;
  onDelete: (id: number) => void;
}

export default function UsersTable({
  rows,
  onEdit,
  onDelete,
}: UsersTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-4 py-3 text-left">F.I.O</th>
            <th className="px-4 py-3 text-left">Telefon</th>
            <th className="px-4 py-3 text-left">Login</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Holat</th>
            <th className="px-4 py-3 text-left">Start time</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((item) => (
            <tr key={item.id} className="border-t border-slate-100">
              <td className="px-4 py-3 whitespace-nowrap">{item.fullName}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.phone || "-"}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.login}</td>
              <td className="px-4 py-3 whitespace-nowrap capitalize">{item.role}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    item.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.isActive ? "Faol" : "Nofaol"}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {item.customStartTime || "-"}
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
          ))}

          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-10 text-center text-slate-500"
              >
                Userlar topilmadi
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}