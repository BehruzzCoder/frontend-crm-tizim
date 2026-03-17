"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { setToken, setUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    login: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const setValue = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorText("");

      const res = await api.post("/auth/login", {
        login: form.login,
        password: form.password,
      });

      const token =
        res.data?.accessToken ||
        res.data?.token ||
        res.data?.access_token;

      const user = res.data?.user;

      if (!token || !user) {
        setErrorText("Login javobi noto‘g‘ri keldi");
        return;
      }

      setToken(token);
      setUser(user);

      router.replace("/dashboard");
    } catch (error: any) {
      setErrorText(
        error?.response?.data?.message || "Login yoki parol noto‘g‘ri"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">CRM Login</h1>
          <p className="mt-2 text-sm text-slate-500">
            Tizimga kirish uchun ma’lumotlaringizni kiriting
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Login
            </label>
            <input
              type="text"
              value={form.login}
              onChange={(e) => setValue("login", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
              placeholder="Login"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Parol
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setValue("password", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
              placeholder="Parol"
            />
          </div>

          {errorText ? (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorText}
            </div>
          ) : null}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
          >
            {loading ? "Kirilmoqda..." : "Kirish"}
          </button>
        </div>
      </div>
    </div>
  );
}