"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import TextInput from "@/components/common/TextInput";
import PrimaryButton from "@/components/common/PrimaryButton";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { MonthlyPlan } from "@/types/plan";

interface MonthlyPlanFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: MonthlyPlan | null;
}

const initialForm = {
  month: "",
  year: "",
  planCalls: "",
  planTalks: "",
  planSalesCount: "",
  planCashSales: "",
  planContractSales: "",
  planDebt: "",
  planTotalCash: "",
  rewardName: "",
  penaltyTask: "",
  userId: "",
};

export default function MonthlyPlanFormModal({
  open,
  onClose,
  onSuccess,
  editData,
}: MonthlyPlanFormModalProps) {
  const user = getUser();
  const isAdmin = user?.role === "admin";

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (editData) {
      setForm({
        month: String(editData.month),
        year: String(editData.year),
        planCalls: String(editData.planCalls),
        planTalks: String(editData.planTalks),
        planSalesCount: String(editData.planSalesCount),
        planCashSales: String(editData.planCashSales),
        planContractSales: String(editData.planContractSales),
        planDebt: String(editData.planDebt),
        planTotalCash: String(editData.planTotalCash),
        rewardName: editData.rewardName || "",
        penaltyTask: editData.penaltyTask || "",
        userId: String(editData.user?.id || ""),
      });
    } else {
      const now = new Date();
      setForm({
        ...initialForm,
        month: String(now.getMonth() + 1),
        year: String(now.getFullYear()),
      });
    }
  }, [editData, open]);

  const setValue = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorText("");

      const payload: any = {
        month: Number(form.month),
        year: Number(form.year),
        planCalls: Number(form.planCalls || 0),
        planTalks: Number(form.planTalks || 0),
        planSalesCount: Number(form.planSalesCount || 0),
        planCashSales: Number(form.planCashSales || 0),
        planContractSales: Number(form.planContractSales || 0),
        planDebt: Number(form.planDebt || 0),
        planTotalCash: Number(form.planTotalCash || 0),
        rewardName: form.rewardName || undefined,
        penaltyTask: form.penaltyTask || undefined,
      };

      if (isAdmin && form.userId) {
        payload.userId = Number(form.userId);
        await api.post("/monthly-plans", payload);
      } else {
        await api.post("/monthly-plans/me", payload);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      setErrorText(error?.response?.data?.message || "Plan saqlashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Oylik plan yozish">
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isAdmin ? (
            <TextInput
              label="Manager ID"
              type="number"
              value={form.userId}
              onChange={(e) => setValue("userId", e.target.value)}
            />
          ) : null}

          <TextInput
            label="Oy"
            type="number"
            value={form.month}
            onChange={(e) => setValue("month", e.target.value)}
          />

          <TextInput
            label="Yil"
            type="number"
            value={form.year}
            onChange={(e) => setValue("year", e.target.value)}
          />
<TextInput
            label="Qo‘ng‘iroq soni"
            type="number"
            value={form.planCalls}
            onChange={(e) => setValue("planCalls", e.target.value)}
          />

          <TextInput
            label="Suhbat soni"
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
            label="Kassadagi sotuv"
            type="number"
            value={form.planCashSales}
            onChange={(e) => setValue("planCashSales", e.target.value)}
          />

          <TextInput
            label="Shartnoma bo‘yicha sotuv"
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
            label="So‘z narxi vazifasi"
            value={form.penaltyTask}
            onChange={(e) => setValue("penaltyTask", e.target.value)}
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