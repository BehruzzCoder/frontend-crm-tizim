"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getUser } from "@/lib/auth";

interface MenuItem {
  label: string;
  href: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const user = getUser();

  const adminMenu: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard" },

  { label: "Lead statistikasi", href: "/leads" },

  { label: "To‘lovlar", href: "/payments" },

  { label: "Attendance", href: "/attendance" },

  { label: "Plan / Fact", href: "/plans" },

  { label: "Users", href: "/users" },

  { label: "Settings", href: "/settings" },

   { label: "Penalties", href: "/penalties" },

];

  const managerMenu: MenuItem[] = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Attendance", href: "/attendance" },
    { label: "Plan / Fact", href: "/plans" },
    { label: "Penalties", href: "/penalties" },
  ];

  const menu = user?.role === "admin" ? adminMenu : managerMenu;

  return (
    <aside className="h-screen w-[260px] shrink-0 border-r border-slate-200 bg-slate-900 text-white">
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-800 px-6 py-5">
          <h1 className="text-xl font-bold">Enterprise CRM</h1>
          <p className="mt-1 text-sm text-slate-300">
            {user?.role === "admin" ? "Admin panel" : "Manager panel"}
          </p>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {menu.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-200 hover:bg-slate-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}