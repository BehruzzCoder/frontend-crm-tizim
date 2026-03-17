"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import TextInput from "@/components/common/TextInput";
import PrimaryButton from "@/components/common/PrimaryButton";
import { api } from "@/lib/api";
import { MonthlyPlan } from "@/types/plan";

interface DailyFactFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  monthlyPlan: MonthlyPlan | null;
}

const initialForm = {
  date: "",
  factCalls: "",
  factTalks: "",
  factSalesCount: "",
  factCashSales: "",
  factContractSales: "",
  factDebt: "",
  factTotalCash: "",
};

export default function DailyFactFormModal({
  open,
  onClose,
  onSuccess,
  monthlyPlan,
}: DailyFactFormModalProps) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setForm({
      ...initialForm,
      date: today,
    });
  }, [open]);

  const setValue = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!monthlyPlan) return;

    try {
      setLoading(true);
      setErrorText("");

      await api.post("/daily-facts/me", {
        monthlyPlanId: monthlyPlan.id,
        date: form.date,
        factCalls: Number(form.factCalls || 0),
        factTalks: Number(form.factTalks || 0),
        factSalesCount: Number(form.factSalesCount || 0),
        factCashSales: Number(form.factCashSales || 0),
        factContractSales: Number(form.factContractSales || 0),
        factDebt: Number(form.factDebt || 0),
        factTotalCash: Number(form.factTotalCash || 0),
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      setErrorText(error?.response?.data?.message || "Fact saqlashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Bugungi faktni yozish">
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <TextInput
            label="Sana"
            type="date"
            value={form.date}
            onChange={(e) => setValue("date", e.target.value)}
          />

          <TextInput
            label="Qo‘ng‘iroq soni"
            type="number"
            value={form.factCalls}
            onChange={(e) => setValue("factCalls", e.target.value)}
          />

          <TextInput
            label="Suhbat soni"
            type="number"
            value={form.factTalks}
            onChange={(e) => setValue("factTalks", e.target.value)}
          />

          <TextInput
            label="Sotuv soni"
            type="number"
            value={form.factSalesCount}
            onChange={(e) => setValue("factSalesCount", e.target.value)}
          />

          <TextInput
            label="Kassadagi sotuv"
            type="number"
            value={form.factCashSales}
            onChange={(e) => setValue("factCashSales", e.target.value)}
          />

          <TextInput
            label="Shartnoma bo‘yicha sotuv"
            type="number"
            value={form.factContractSales}
            onChange={(e) => setValue("factContractSales", e.target.value)}
          />

          <TextInput
            label="Qarzdorlik"
            type="number"
            value={form.factDebt}
            onChange={(e) => setValue("factDebt", e.target.value)}
          />

          <TextInput
            label="Umumiy kassa"
            type="number"
            value={form.factTotalCash}
            onChange={(e) => setValue("factTotalCash", e.target.value)}
          />
        </div>

        {errorText ? (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorText}
          </div>
        ) : null}
<div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-3 text-slate-700"
          >
            Bekor qilish
          </button>
          <PrimaryButton onClick={handleSubmit} disabled={loading}>
            {loading ? "Saqlanmoqda..." : "Saqlash"}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}