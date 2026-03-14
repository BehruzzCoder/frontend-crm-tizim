"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TextInput from "@/components/common/TextInput";
import PrimaryButton from "@/components/common/PrimaryButton";
import { api } from "@/lib/api";
import { getToken, setToken, setUser } from "@/lib/auth";
import { LoginResponse } from "@/types/user";

export default function LoginPage() {
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const token = getToken();

    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorText("");
    setLoading(true);

    try {
      const res = await api.post<LoginResponse>("/auth/login", {
        login,
        password,
      });

      setToken(res.data.token);
      setUser(res.data.user);

      router.push("/dashboard");
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
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg border border-slate-200">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-900">CRM Login</h1>
          <p className="mt-2 text-slate-500">
            Tizimga kirish uchun login va parol kiriting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="Login"
            placeholder="admin"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <TextInput
            label="Parol"
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorText ? (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorText}
            </div>
          ) : null}

          <PrimaryButton type="submit" disabled={loading} className="w-full">
            {loading ? "Kirilmoqda..." : "Kirish"}
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}