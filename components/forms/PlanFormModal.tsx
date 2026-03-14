"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import TextInput from "@/components/common/TextInput";
import PrimaryButton from "@/components/common/PrimaryButton";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Plan } from "@/types/plan";

interface PlanFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Plan | null;
}

const initialForm = {
  type: "daily",
  startDate: "",
  endDate: "",
  planCalls: "",
  planTalks: "",
  planInterestedClients: "",
  planSalesCount: "",
  planCashSales: "",
  planContractSales: "",
  planDebt: "",
  planTotalCash: "",
  rewardName: "",
  penaltyTask: "",
};

export default function PlanFormModal({
  open,
  onClose,
  onSuccess,
  editData,
}: PlanFormModalProps) {
  const user = getUser();
  const isAdmin = user?.role === "admin";

  const [form, setForm] = useState(initialForm);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (editData) {
      setUserId(String(editData.user?.id ?? ""));
      setForm({
        type: editData.type,
        startDate: editData.startDate || "",
        endDate: editData.endDate || "",
        planCalls: String(editData.planCalls ?? 0),
        planTalks: String(editData.planTalks ?? 0),
        planInterestedClients: String(editData.planInterestedClients ?? 0),
        planSalesCount: String(editData.planSalesCount ?? 0),
        planCashSales: String(editData.planCashSales ?? 0),
        planContractSales: String(editData.planContractSales ?? 0),
        planDebt: String(editData.planDebt ?? 0),
        planTotalCash: String(editData.planTotalCash ?? 0),
        rewardName: editData.rewardName || "",
        penaltyTask: editData.penaltyTask || "",
      });
    } else {
      setUserId("");
      setForm(initialForm);
    }
  }, [editData, open]);

  const setValue = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const payload = {
    type: form.type,
    startDate: form.startDate,
    endDate: form.endDate || undefined,
    planCalls: Number(form.planCalls || 0),
    planTalks: Number(form.planTalks || 0),
    planInterestedClients: Number(form.planInterestedClients || 0),
    planSalesCount: Number(form.planSalesCount || 0),
    planCashSales: Number(form.planCashSales || 0),
    planContractSales: Number(form.planContractSales || 0),
    planDebt: Number(form.planDebt || 0),
    planTotalCash: Number(form.planTotalCash || 0),
    rewardName: form.rewardName || undefined,
    penaltyTask: form.penaltyTask || undefined,
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorText("");

      if (editData) {
        await api.put(`/plans/${editData.id}`, {
          ...payload,
          userId: Number(userId),
        });
      } else {
        if (isAdmin) {
          await api.post("/plans", {
            ...payload,
            userId: Number(userId),
          });
        } else {
          await api.post("/plans/me", payload);
        }
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      setErrorText(
        error?.response?.data?.message || "Plan saqlashda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editData ? "Planni tahrirlash" : "Yangi plan yaratish"}
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isAdmin ? (
            <TextInput
              label="User ID"
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          ) : null}
[3/14/26 6:41 AM] بهروز: <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Plan turi</label>
            <select
              value={form.type}
              onChange={(e) => setValue("type", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            >
              <option value="daily">Kunlik</option>
              <option value="weekly">Haftalik</option>
              <option value="monthly">Oylik</option>
            </select>
          </div>

          <TextInput
            label="Boshlanish sanasi"
            type="date"
            value={form.startDate}
            onChange={(e) => setValue("startDate", e.target.value)}
          />

          <TextInput
            label="Tugash sanasi"
            type="date"
            value={form.endDate}
            onChange={(e) => setValue("endDate", e.target.value)}
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
            label="Qiziqqan mijozlar"
            type="number"
            value={form.planInterestedClients}
            onChange={(e) => setValue("planInterestedClients", e.target.value)}
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