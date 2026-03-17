"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import TextInput from "@/components/common/TextInput";
import PrimaryButton from "@/components/common/PrimaryButton";
import { api } from "@/lib/api";

interface UserItem {
  id: number;
  fullName: string;
  login: string;
  role: string;
}

interface Plan {
  id: number;
  type?: string;
  startDate?: string;
  endDate?: string;
  planCalls?: number;
  planTalks?: number;
  planInterestedClients?: number;
  planSalesCount?: number;
  planCashSales?: number;
  planContractSales?: number;
  planDebt?: number;
  planTotalCash?: number;
  rewardName?: string | null;
  penaltyTask?: string | null;
  user?: {
    id?: number;
    fullName?: string;
  };
}

interface PlanFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Plan | null;
}

const initialForm = {
  type: "",
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
  const [form, setForm] = useState(initialForm);
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [errorText, setErrorText] = useState("");

  const isEdit = !!editData;

  const setValue = (key: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const fetchManagers = async () => {
    try {
      setFetchingUsers(true);
      const res = await api.get<UserItem[]>("/users/managers");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Managerlarni olishda xatolik:", error);
      setUsers([]);
    } finally {
      setFetchingUsers(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    setErrorText("");
    fetchManagers();

    if (editData) {
      setUserId(String(editData.user?.id ?? ""));

      setForm({
        type: editData.type ?? "",
        startDate: editData.startDate ?? "",
        endDate: editData.endDate ?? "",
        planCalls: String(editData.planCalls ?? 0),
        planTalks: String(editData.planTalks ?? 0),
        planInterestedClients: String(editData.planInterestedClients ?? 0),
        planSalesCount: String(editData.planSalesCount ?? 0),
        planCashSales: String(editData.planCashSales ?? 0),
        planContractSales: String(editData.planContractSales ?? 0),
        planDebt: String(editData.planDebt ?? 0),
        planTotalCash: String(editData.planTotalCash ?? 0),
        rewardName: editData.rewardName ?? "",
        penaltyTask: editData.penaltyTask ?? "",
      });
    } else {
      setUserId("");
      setForm(initialForm);
    }
  }, [open, editData]);

  const handleSubmit = async () => {
    if (!userId) {
      setErrorText("Manager tanlang");
      return;
    }

    if (!form.type) {
      setErrorText("Turini tanlang");
      return;
    }

    if (!form.startDate || !form.endDate) {
      setErrorText("Boshlanish va tugash sanasini kiriting");
      return;
    }

    try {
      setLoading(true);
      setErrorText("");

      const payload = {
        userId: Number(userId),
        type: form.type,
        startDate: form.startDate,
        endDate: form.endDate,
        planCalls: Number(form.planCalls || 0),
        planTalks: Number(form.planTalks || 0),
        planInterestedClients: Number(form.planInterestedClients || 0),
        planSalesCount: Number(form.planSalesCount || 0),
planCashSales: Number(form.planCashSales || 0),
        planContractSales: Number(form.planContractSales || 0),
        planDebt: Number(form.planDebt || 0),
        planTotalCash: Number(form.planTotalCash || 0),
        rewardName: form.rewardName || null,
        penaltyTask: form.penaltyTask || null,
      };

      if (isEdit && editData?.id) {
        await api.put(`/plans/${editData.id}`, payload);
      } else {
        await api.post("/plans", payload);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Plan saqlashda xatolik:", error);
      setErrorText(error?.response?.data?.message || "Plan saqlashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Plan tahrirlash" : "Yangi plan qo‘shish"}
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Manager</label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
              disabled={fetchingUsers}
            >
              <option value="">Manager tanlang</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Turi</label>
            <select
              value={form.type}
              onChange={(e) => setValue("type", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            >
              <option value="">Turini tanlang</option>
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
            label="Plan qo‘ng‘iroq"
            type="number"
            value={form.planCalls}
            onChange={(e) => setValue("planCalls", e.target.value)}
          />

          <TextInput
            label="Plan suhbat"
            type="number"
            value={form.planTalks}
            onChange={(e) => setValue("planTalks", e.target.value)}
          />

          <TextInput
            label="Qiziqqan klientlar"
            type="number"
            value={form.planInterestedClients}
            onChange={(e) => setValue("planInterestedClients", e.target.value)}
          />

          <TextInput
            label="Plan sotuv soni"
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
            label="Oylik vazifa / jarima"
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
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-3 text-slate-700"
          >
            Bekor qilish
          </button>

          <PrimaryButton type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saqlanmoqda..." : isEdit ? "Yangilash" : "Saqlash"}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}