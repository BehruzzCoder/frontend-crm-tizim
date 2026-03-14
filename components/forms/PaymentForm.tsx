"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AlertBox from "@/components/common/AlertBox";
import TextInput from "@/components/common/TextInput";
import PrimaryButton from "@/components/common/PrimaryButton";

type PaymentFormData = {
  fullName: string;
  phone: string;
  manager: string;
  stream: string;
  tariff: string;
  amount: string;
  debt: string;
  paymentType: string;
  receipt: File | null;
};

const initialState: PaymentFormData = {
  fullName: "",
  phone: "",
  manager: "",
  stream: "",
  tariff: "",
  amount: "",
  debt: "",
  paymentType: "",
  receipt: null,
};

interface EditPaymentData {
  id: number;
  fullName: string;
  phone: string;
  manager: string;
  stream: string;
  tariff: string;
  amount: number;
  debt: number;
  paymentType: string;
}

interface Props {
  onSuccess?: () => void;
  editData?: EditPaymentData | null;
  onCancelEdit?: () => void;
}

export default function PaymentForm({
  onSuccess,
  editData,
  onCancelEdit,
}: Props) {
  const [form, setForm] = useState<PaymentFormData>(initialState);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (editData) {
      setForm({
        fullName: editData.fullName,
        phone: editData.phone,
        manager: editData.manager,
        stream: editData.stream,
        tariff: editData.tariff,
        amount: String(editData.amount),
        debt: String(editData.debt),
        paymentType: editData.paymentType,
        receipt: null,
      });
    } else {
      setForm(initialState);
    }
  }, [editData]);

  const handleChange = (
    key: keyof PaymentFormData,
    value: string | File | null
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (editData?.id) {
        await api.put(`/payments/${editData.id}`, {
          fullName: form.fullName,
          phone: form.phone,
          manager: form.manager,
          stream: form.stream,
          tariff: form.tariff,
          amount: Number(form.amount || 0),
          debt: Number(form.debt || 0),
          paymentType: form.paymentType,
        });

        setSuccessMessage("To‘lov muvaffaqiyatli yangilandi");
      } else {
        const body = new FormData();

        body.append("fullName", form.fullName);
        body.append("phone", form.phone);
        body.append("manager", form.manager);
        body.append("stream", form.stream);
        body.append("tariff", form.tariff);
        body.append("amount", String(Number(form.amount || 0)));
        body.append("debt", String(Number(form.debt || 0)));
        body.append("paymentType", form.paymentType);

        if (form.receipt) {
          body.append("receipt", form.receipt);
        }

        await api.post("/payments", body, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setSuccessMessage("To‘lov muvaffaqiyatli saqlandi");
      }

      setForm(initialState);
      onSuccess?.();
    } catch (error) {
      setErrorMessage("To‘lovni saqlashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-4"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          {editData ? "To‘lovni tahrirlash" : "To‘lov qo‘shish"}
        </h2>

        {editData && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-xl bg-slate-200 px-4 py-2 text-sm"
          >
            Bekor qilish
          </button>
        )}
      </div>
{successMessage && <AlertBox type="success" message={successMessage} />}
      {errorMessage && <AlertBox type="error" message={errorMessage} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Ism familiya"
          value={form.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          required
        />

        <TextInput
          label="Telefon"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          required
        />

        <TextInput
          label="Menedjer"
          value={form.manager}
          onChange={(e) => handleChange("manager", e.target.value)}
          required
        />

        <TextInput
          label="Patok"
          value={form.stream}
          onChange={(e) => handleChange("stream", e.target.value)}
          required
        />

        <TextInput
          label="Tarif"
          value={form.tariff}
          onChange={(e) => handleChange("tariff", e.target.value)}
          required
        />

        <TextInput
          label="To‘lov summasi"
          value={form.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          required
        />

        <TextInput
          label="Qarzdorlik"
          value={form.debt}
          onChange={(e) => handleChange("debt", e.target.value)}
          required
        />

        <TextInput
          label="To‘lov turi"
          value={form.paymentType}
          onChange={(e) => handleChange("paymentType", e.target.value)}
          required
        />

        {!editData && (
          <div>
            <label className="mb-1 block text-sm text-slate-600">Chek</label>
            <input
              type="file"
              onChange={(e) =>
                handleChange("receipt", e.target.files?.[0] || null)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            />
          </div>
        )}
      </div>

      <PrimaryButton type="submit" disabled={loading}>
        {loading
          ? "Saqlanmoqda..."
          : editData
          ? "Yangilash"
          : "To‘lovni saqlash"}
      </PrimaryButton>
    </form>
  );
}