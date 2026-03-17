 "use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SectionTitle from "@/components/common/SectionTitle";
import PrimaryButton from "@/components/common/PrimaryButton";
import TextInput from "@/components/common/TextInput";
import StatCard from "@/components/common/StatCard";
import { api } from "@/lib/api";
import { SettingsItem } from "@/types/settings";

function moneyFormat(value: number) {
  return Number(value || 0).toLocaleString("ru-RU");
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [form, setForm] = useState({
    workStartTime: "10:00",
    workEndTime: "19:00",
    latePenaltyAmount: "100000",
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get<SettingsItem>("/settings");
      setSettings(res.data);
      setForm({
        workStartTime: res.data.workStartTime || "10:00",
        workEndTime: res.data.workEndTime || "19:00",
        latePenaltyAmount: String(res.data.latePenaltyAmount || 100000),
      });
    } catch (error) {
      console.error("Settings yuklashda xatolik:", error);
      setSettings(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const setValue = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorText("");

      const payload = {
        workStartTime: form.workStartTime,
        workEndTime: form.workEndTime,
        latePenaltyAmount: Number(form.latePenaltyAmount || 0),
      };

      if (settings?.id) {
        await api.put(`/settings/${settings.id}`, payload);
      } else {
        await api.post("/settings", payload);
      }

      await fetchSettings();
    } catch (error: any) {
      setErrorText(
        error?.response?.data?.message || "Sozlamalarni saqlashda xatolik"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionTitle
          title="Sozlamalar"
          subtitle="Ish vaqti va kechikish jarimalarini boshqarish"
        />

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
            Yuklanmoqda...
          </div>
        ) : null}

        {!loading ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard
                title="Ish boshlanish vaqti"
                value={settings?.workStartTime || "-"}
              />
              <StatCard
                title="Ish tugash vaqti"
                value={settings?.workEndTime || "-"}
              />
              <StatCard
                title="Kechikish jarimasi"
                value={moneyFormat(Number(settings?.latePenaltyAmount || 0))}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <TextInput
                  label="Ish boshlanish vaqti"
                  type="time"
                  value={form.workStartTime}
                  onChange={(e) => setValue("workStartTime", e.target.value)}
                />

                <TextInput
                  label="Ish tugash vaqti"
                  type="time"
                  value={form.workEndTime}
                  onChange={(e) => setValue("workEndTime", e.target.value)}
                />
 <TextInput
                  label="Kechikish jarimasi"
                  type="number"
                  value={form.latePenaltyAmount}
                  onChange={(e) => setValue("latePenaltyAmount", e.target.value)}
                />
              </div>

              {errorText ? (
                <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {errorText}
                </div>
              ) : null}

              <div className="mt-5 flex justify-end">
                <PrimaryButton type="button" onClick={handleSave} disabled={saving}>
                  {saving ? "Saqlanmoqda..." : "Saqlash"}
                </PrimaryButton>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </MainLayout>
  );
}