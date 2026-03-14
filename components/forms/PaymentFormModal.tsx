"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/common/Modal";
import TextInput from "@/components/common/TextInput";
import PrimaryButton from "@/components/common/PrimaryButton";
import { api } from "@/lib/api";
import { Payment } from "@/types/payment";

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
  editData?: Payment | null;
}

const initialForm = {
  fullName: "",
  phone: "",
  managerId: "",
  stream: "",
  tariff: "",
  amount: "",
  debt: "",
  paymentType: "",
};

export default function PaymentFormModal({
  open,
  onClose,
  onSuccess,
  editData,
}: PaymentFormModalProps) {
  const [form, setForm] = useState(initialForm);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [users, setUsers] = useState<ManagerUser[]>([]);
  const [managerSearch, setManagerSearch] = useState("");

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await api.get<ManagerUser[]>("/users");
        const onlyManagers = res.data.filter((item) => item.role === "manager");
        setUsers(onlyManagers);
      } catch {
        setUsers([]);
      }
    };

    if (open) {
      fetchManagers();
    }
  }, [open]);

  useEffect(() => {
    if (editData) {
      setForm({
        fullName: editData.fullName || "",
        phone: editData.phone || "",
        managerId: String(editData.manager?.id ?? ""),
        stream: editData.stream || "",
        tariff: editData.tariff || "",
        amount: String(editData.amount ?? 0),
        debt: String(editData.debt ?? 0),
        paymentType: editData.paymentType || "",
      });

      setManagerSearch(editData.manager?.fullName || "");
    } else {
      setForm(initialForm);
      setManagerSearch("");
    }

    setReceiptFile(null);
  }, [editData, open]);

  const filteredManagers = useMemo(() => {
    if (!managerSearch.trim()) return users;

    return users.filter(
      (item) =>
        item.fullName.toLowerCase().includes(managerSearch.toLowerCase()) ||
        item.login.toLowerCase().includes(managerSearch.toLowerCase())
    );
  }, [users, managerSearch]);

  const setValue = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectManager = (manager: ManagerUser) => {
    setForm((prev) => ({ ...prev, managerId: String(manager.id) }));
    setManagerSearch(manager.fullName);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorText("");

      if (!form.managerId) {
        setErrorText("Manager tanlang");
        return;
      }

      if (editData) {
        await api.put(`/payments/${editData.id}`, {
          fullName: form.fullName,
          phone: form.phone,
          managerId: Number(form.managerId),
          stream: form.stream,
          tariff: form.tariff,
          amount: Number(form.amount || 0),
          debt: Number(form.debt || 0),
          paymentType: form.paymentType,
        });
      } else {
        const formData = new FormData();
        formData.append("fullName", form.fullName);
        formData.append("phone", form.phone);
        formData.append("managerId", String(Number(form.managerId)));
        formData.append("stream", form.stream);
        formData.append("tariff", form.tariff);
        formData.append("amount", String(Number(form.amount || 0)));
        formData.append("debt", String(Number(form.debt || 0)));
        formData.append("paymentType", form.paymentType);

        if (receiptFile) {
          formData.append("receipt", receiptFile);
        }

        await api.post("/payments", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      setErrorText(
        error?.response?.data?.message || "Saqlashda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editData ? "To‘lovni tahrirlash" : "Yangi to‘lov qo‘shish"}
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            label="Ism familiya"
            value={form.fullName}
            onChange={(e) => setValue("fullName", e.target.value)}
          />

          <TextInput
            label="Telefon"
            value={form.phone}
            onChange={(e) => setValue("phone", e.target.value)}
          />

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Manager</label>

            <TextInput
              placeholder="Manager qidiring..."
              value={managerSearch}
              onChange={(e) => {
                setManagerSearch(e.target.value);
                setForm((prev) => ({ ...prev, managerId: "" }));
              }}
            />

            <div className="max-h-52 overflow-y-auto rounded-xl border border-slate-200">
              {filteredManagers.map((manager) => (
                <button
                  key={manager.id}
                  type="button"
                  onClick={() => handleSelectManager(manager)}
                  className={`flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50 ${
                    Number(form.managerId) === manager.id ? "bg-blue-50" : ""
                  }`}
                >
                  <span className="font-medium text-slate-900">
                    {manager.fullName}
                  </span>
                  <span className="text-sm text-slate-500">{manager.login}</span>
                </button>
              ))}

              {filteredManagers.length === 0 ? (
                <div className="px-4 py-4 text-sm text-slate-500">
                  Manager topilmadi
                </div>
              ) : null}
            </div>
          </div>

          <TextInput
            label="Patok / Stream"
            value={form.stream}
            onChange={(e) => setValue("stream", e.target.value)}
          />

          <TextInput
            label="Tarif"
            value={form.tariff}
            onChange={(e) => setValue("tariff", e.target.value)}
          />

          <TextInput
            label="Payment turi"
            value={form.paymentType}
            onChange={(e) => setValue("paymentType", e.target.value)}
          />

          <TextInput
            label="To‘lov summasi"
            type="number"
            value={form.amount}
            onChange={(e) => setValue("amount", e.target.value)}
          />

          <TextInput
            label="Qarzdorlik"
            type="number"
            value={form.debt}
            onChange={(e) => setValue("debt", e.target.value)}
          />
        </div>

        {!editData ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Chek</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>
        ) : null}

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