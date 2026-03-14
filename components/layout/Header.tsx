"use client";

import { useRouter } from "next/navigation";
import { clearAuth, getUser } from "@/lib/auth";

export default function Header() {
  const router = useRouter();
  const user = getUser();

  const handleLogout = () => {
    const ok = window.confirm("Rostan ham tizimdan chiqmoqchimisiz?");
    if (!ok) return;

    clearAuth();
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">CRM Panel</h2>
        <p className="text-sm text-slate-500">
          {user?.fullName || "Foydalanuvchi"}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
      >
        Logout
      </button>
    </header>
  );
}