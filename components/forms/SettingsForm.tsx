"use client";

import { useEffect, useState } from "react";
import TextInput from "@/components/common/TextInput";
import PrimaryButton from "@/components/common/PrimaryButton";
import { api } from "@/lib/api";
import { Settings } from "@/types/settings";

export default function SettingsForm() {
  const [data, setData] = useState<Settings | null>(null);
  const [form, setForm] = useState({
    workStartTime: "",
    defaultPenaltyAmount: "",
    repeatedPenaltyIncrease: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [errorText, setErrorText] = useState("");

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get<Settings>("/settings");
      setData(res.data);
      setForm({
        workStartTime: res.data.workStartTime || "",
        defaultPenaltyAmount: String(res.data.defaultPenaltyAmount ?? 0),
        repeatedPenaltyIncrease: String(res.data.repeatedPenaltyIncrease ?? 0),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccessText("");
      setErrorText("");

      await api.put("/settings", {
        workStartTime: form.workStartTime,
        defaultPenaltyAmount: Number(form.defaultPenaltyAmount || 0),
        repeatedPenaltyIncrease: Number(form.repeatedPenaltyIncrease || 0),
      });

      setSuccessText("Sozlamalar muvaffaqiyatli saqlandi");
      fetchSettings();
    } catch (error: any) {
      setErrorText(
        error?.response?.data?.message || "Saqlashda xatolik yuz berdi"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-slate-500">Yuklanmoqda...</div>;
  }

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <TextInput
          label="Ish boshlanish vaqti"
          type="time"
          value={form.workStartTime}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, workStartTime: e.target.value }))
          }
        />

        <TextInput
          label="Default penalty amount"
          type="number"
          value={form.defaultPenaltyAmount}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              defaultPenaltyAmount: e.target.value,
            }))
          }
        />

        <TextInput
          label="Repeated penalty increase"
          type="number"
          value={form.repeatedPenaltyIncrease}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              repeatedPenaltyIncrease: e.target.value,
            }))
          }
        />
      </div>

      {successText ? (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          {successText}
        </div>
      ) : null}

      {errorText ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorText}
        </div>
      ) : null}

      <div className="flex justify-end">
        <PrimaryButton onClick={handleSave} disabled={saving}>
          {saving ? "Saqlanmoqda..." : "Sozlamalarni saqlash"}
        </PrimaryButton>
      </div>
    </div>
  );
}