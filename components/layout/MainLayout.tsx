"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getUser, logout, type AuthUser } from "@/lib/auth";

interface MainLayoutProps {
  children: ReactNode;
}

interface MenuItem {
  label: string;
  href: string;
  roles: Array<"admin" | "manager">;
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard", roles: ["admin", "manager"] },
  { label: "Attendance", href: "/attendance", roles: ["admin", "manager"] },
  { label: "Plan / Fakt", href: "/plans", roles: ["admin", "manager"] },
  { label: "To‘lovlar", href: "/payments", roles: ["admin"] },
  { label: "Reyting", href: "/rating", roles: ["admin"] },
  { label: "Oylik", href: "/salary", roles: ["admin", "manager"] },
  { label: "Analytics", href: "/analytics", roles: ["admin"] },
  { label: "Managerlar", href: "/users", roles: ["admin"] },
  { label: "Jarimalar", href: "/penalties", roles: ["admin", "manager"] },
  { label: "Sozlamalar", href: "/settings", roles: ["admin"] },
  {label: "Leads", href: "/leads", roles: ["admin"]}
];

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedUser = getUser();
    setUser(savedUser);

    const savedSidebar = localStorage.getItem("sidebar-collapsed");
    if (savedSidebar === "true") {
      setSidebarCollapsed(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("sidebar-collapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed, mounted]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  const filteredMenu = useMemo(() => {
    if (!user?.role) return [];
    return menuItems.filter((item) => item.roles.includes(user.role));
  }, [user]);

  const handleLogout = () => {
    const ok = window.confirm("Rostan ham tizimdan chiqmoqchimisiz?");
    if (!ok) return;

    logout();
    router.replace("/login");
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-slate-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const desktopSidebarWidth = sidebarCollapsed ? "w-[88px]" : "w-[260px]";

  return (
    <div className="min-h-screen bg-slate-100">
      {mobileSidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-800 bg-[#081226] text-white transition-all duration-300 ${desktopSidebarWidth} ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
          <div className={sidebarCollapsed ? "hidden" : "block"}>
            <h1 className="text-xl font-bold">CRM</h1>
            <p className="mt-1 text-xs text-slate-400">
              {user?.role === "admin" ? "Admin panel" : "Manager panel"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="hidden rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 lg:block"
          >
            {sidebarCollapsed ? ">" : "<"}
          </button>
<button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 lg:hidden"
          >
            X
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
          {filteredMenu.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-sky-500 text-white"
                    : "text-slate-200 hover:bg-slate-800"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
                title={sidebarCollapsed ? item.label : ""}
              >
                {sidebarCollapsed ? item.label.charAt(0) : item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600"
          >
            {sidebarCollapsed ? "L" : "Logout"}
          </button>
        </div>
      </aside>

      <div
        className={`min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-[88px]" : "lg:ml-[260px]"
        }`}
      >
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between px-4 py-4 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 lg:hidden"
              >
                ☰
              </button>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">CRM Panel</h2>
                <p className="text-sm text-slate-500">{user?.fullName || "-"}</p>
              </div>
            </div>

            <div className="hidden text-sm text-slate-500 md:block">
              {user?.role === "admin" ? "Admin" : "Manager"}
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}