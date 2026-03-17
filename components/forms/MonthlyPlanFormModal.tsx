"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal";
import PrimaryButton from "@/components/common/PrimaryButton";
import TextInput from "@/components/common/TextInput";
import { api } from "@/lib/api";

interface MonthlyPlanFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  month: number;
  year: number;
}

export default function MonthlyPlanFormModal({
  open,
  onClose,
  onSuccess,
  userId,
  month,
  year,
}: MonthlyPlanFormModalProps) {
  const [form, setForm] = useState({
    planCalls: "",
    planTalks: "",
    planSalesCount: "",
    planCashSales: "",
    planContractSales: "",
    planDebt: "",
    planTotalCash: "",
    rewardName: "",
    penaltyTask: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const setValue = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      setErrorText("Manager tanlang");
      return;
    }

    try {
      setLoading(true);
      setErrorText("");

      await api.post("/monthly-plans", {
        userId: Number(userId),
        month,
        year,
        planCalls: Number(form.planCalls || 0),
        planTalks: Number(form.planTalks || 0),
        planSalesCount: Number(form.planSalesCount || 0),
        planCashSales: Number(form.planCashSales || 0),
        planContractSales: Number(form.planContractSales || 0),
        planDebt: Number(form.planDebt || 0),
        planTotalCash: Number(form.planTotalCash || 0),
        rewardName: form.rewardName || null,
        penaltyTask: form.penaltyTask || null,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      setErrorText(
        error?.response?.data?.message || "Oylik plan saqlanmadi"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Oylik plan yozish">
      <div className="space-y-4">
        <TextInput
          label="Qo‘ng‘iroq"
          type="number"
          value={form.planCalls}
          onChange={(e) => setValue("planCalls", e.target.value)}
        />
        <TextInput
          label="Suhbat"
          type="number"
          value={form.planTalks}
          onChange={(e) => setValue("planTalks", e.target.value)}
        />
        <TextInput
          label="Sotuv soni"
          type="number"
          value={form.planSalesCount}
          onChange={(e) => setValue("planSalesCount", e.target.value)}
        />
        <TextInput
          label="Naqd savdo"
          type="number"
          value={form.planCashSales}
          onChange={(e) => setValue("planCashSales", e.target.value)}
        />
        <TextInput
          label="Shartnoma savdo"
          type="number"
          value={form.planContractSales}
          onChange={(e) => setValue("planContractSales", e.target.value)}
        />
        <TextInput
          label="Qarzdorlik"
          type="number"
          value={form.planDebt}
          onChange={(e) => setValue("planDebt", e.target.value)}
        />
        <TextInput
          label="Umumiy kassa"
          type="number"
          value={form.planTotalCash}
          onChange={(e) => setValue("planTotalCash", e.target.value)}
        />
        <TextInput
          label="Mukofot"
          value={form.rewardName}
          onChange={(e) => setValue("rewardName", e.target.value)}
        />
        <TextInput
          label="Vazifa"
          value={form.penaltyTask}
          onChange={(e) => setValue("penaltyTask", e.target.value)}
        />

        {errorText ? (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorText}
          </div>
        ) : null}
<div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-3"
          >
            Bekor qilish
          </button>
          <PrimaryButton type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saqlanmoqda..." : "Saqlash"}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}