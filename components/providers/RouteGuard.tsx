"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getToken, getUser } from "@/lib/auth";

interface RouteGuardProps {
  children: ReactNode;
}

const publicRoutes = ["/login"];

const roleRoutes: Record<string, Array<"admin" | "manager">> = {
  "/dashboard": ["admin", "manager"],
  "/attendance": ["admin", "manager"],
  "/plans": ["admin", "manager"],
  "/payments": ["admin", "manager"],
  "/salary": ["admin", "manager"],
  "/penalties": ["admin", "manager"],

  "/rating": ["admin"],
  "/analytics": ["admin"],
  "/users": ["admin"],
  "/settings": ["admin"],
};

export default function RouteGuard({ children }: RouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);

  const isPublic = useMemo(() => {
    return publicRoutes.includes(pathname);
  }, [pathname]);

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (isPublic) {
      if (token && user) {
        router.replace("/dashboard");
        return;
      }

      setAllowed(true);
      return;
    }

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    const matchedEntry = Object.entries(roleRoutes).find(([route]) =>
      pathname.startsWith(route)
    );

    if (!matchedEntry) {
      setAllowed(true);
      return;
    }

    const [, allowedRoles] = matchedEntry;

    if (!allowedRoles.includes(user.role)) {
      router.replace("/dashboard");
      return;
    }

    setAllowed(true);
  }, [pathname, router, isPublic]);

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-slate-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}