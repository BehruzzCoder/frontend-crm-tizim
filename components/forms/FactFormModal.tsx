"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import TextInput from "@/components/common/TextInput";
import PrimaryButton from "@/components/common/PrimaryButton";
import { api } from "@/lib/api";
import { Plan } from "@/types/plan";

interface FactFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  plan: Plan | null;
}

const initialForm = {
  factCalls: "",
  factTalks: "",
  factInterestedClients: "",
  factSalesCount: "",
  factCashSales: "",
  factContractSales: "",
  factDebt: "",
  factTotalCash: "",
};

export default function FactFormModal({
  open,
  onClose,
  onSuccess,
  plan,
}: FactFormModalProps) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (plan) {
      setForm({
        factCalls: String(plan.factCalls ?? 0),
        factTalks: String(plan.factTalks ?? 0),
        factInterestedClients: String(plan.factInterestedClients ?? 0),
        factSalesCount: String(plan.factSalesCount ?? 0),
        factCashSales: String(plan.factCashSales ?? 0),
        factContractSales: String(plan.factContractSales ?? 0),
        factDebt: String(plan.factDebt ?? 0),
        factTotalCash: String(plan.factTotalCash ?? 0),
      });
    } else {
      setForm(initialForm);
    }
  }, [plan, open]);

  const setValue = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!plan) return;

    try {
      setLoading(true);
      setErrorText("");

      await api.post(`/plans/${plan.id}/fact`, {
        factCalls: Number(form.factCalls || 0),
        factTalks: Number(form.factTalks || 0),
        factInterestedClients: Number(form.factInterestedClients || 0),
        factSalesCount: Number(form.factSalesCount || 0),
        factCashSales: Number(form.factCashSales || 0),
        factContractSales: Number(form.factContractSales || 0),
        factDebt: Number(form.factDebt || 0),
        factTotalCash: Number(form.factTotalCash || 0),
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      setErrorText(
        error?.response?.data?.message || "Fact yozishda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Fakt yozish">
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            label="Qiziqqan mijozlar"
            type="number"
            value={form.factInterestedClients}
            onChange={(e) => setValue("factInterestedClients", e.target.value)}
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
            {loading ? "Saqlanmoqda..." : "Fakt saqlash"}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}