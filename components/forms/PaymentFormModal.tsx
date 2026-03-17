 "use client";

import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import TextInput from "@/components/common/TextInput";
import PrimaryButton from "@/components/common/PrimaryButton";
import { api } from "@/lib/api";

interface ManagerUser {
  id: number;
  fullName: string;
  login: string;
  role: string;
}

interface PaymentFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const paymentTypes = [
  "Naqd",
  "Click",
  "Alif nasiya",
  "Alif karta",
  "Payme",
  "Anor nasiya",
  "Anorbank",
  "Uzum nasiya",
  "B2B",
  "Terminal uzcard",
  "D/S",
];

const tariffs = ["VIP", "Business", "Premium"];

const initialForm = {
  managerId: "",
  clientName: "",
  phone: "",
  tariff: "VIP",
  paymentType: "Naqd",
  amount: "",
  contractAmount: "",
  debt: "",
};

export default function PaymentFormModal({
  open,
  onClose,
  onSuccess,
}: PaymentFormModalProps) {
  const [form, setForm] = useState(initialForm);
  const [managers, setManagers] = useState<ManagerUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const fetchManagers = async () => {
  try {
    const res = await api.get("/users/managers");
    setManagers(Array.isArray(res.data) ? res.data : []);
  } catch (error) {
    console.error("Managerlarni olishda xatolik:", error);
    setManagers([]);
  }
};

    if (open) {
      fetchManagers();
      setForm(initialForm);
      setErrorText("");
    }
  }, [open]);

  const setValue = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorText("");

      await api.post("/payments", {
        managerId: Number(form.managerId),
        clientName: form.clientName,
        phone: form.phone,
        tariff: form.tariff,
        paymentType: form.paymentType,
        amount: Number(form.amount || 0),
        contractAmount: Number(form.contractAmount || 0),
        debt: Number(form.debt || 0),
        receipts: [],
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      setErrorText(error?.response?.data?.message || "To‘lov saqlashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Yangi to‘lov qo‘shish">
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Manager</label>
            <select
              value={form.managerId}
              onChange={(e) => setValue("managerId", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            >
              <option value="">Manager tanlang</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.fullName}
                </option>
              ))}
            </select>
          </div>

          <TextInput
            label="Mijoz ismi"
            value={form.clientName}
            onChange={(e) => setValue("clientName", e.target.value)}
          />

          <TextInput
            label="Telefon"
            value={form.phone}
            onChange={(e) => setValue("phone", e.target.value)}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tarif</label>
            <select
              value={form.tariff}
              onChange={(e) => setValue("tariff", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            >
              {tariffs.map((tariff) => (
                <option key={tariff} value={tariff}>
                  {tariff}
                </option>
              ))}
            </select>
          </div>
 <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">To‘lov turi</label>
            <select
              value={form.paymentType}
              onChange={(e) => setValue("paymentType", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            >
              {paymentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <TextInput
            label="To‘lov summasi"
            type="number"
            value={form.amount}
            onChange={(e) => setValue("amount", e.target.value)}
          />

          <TextInput
            label="Shartnoma summasi"
            type="number"
            value={form.contractAmount}
            onChange={(e) => setValue("contractAmount", e.target.value)}
          />

          <TextInput
            label="Qarzdorlik"
            type="number"
            value={form.debt}
            onChange={(e) => setValue("debt", e.target.value)}
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