"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import TextInput from "@/components/common/TextInput";
import PrimaryButton from "@/components/common/PrimaryButton";
import { api } from "@/lib/api";
import { Lead } from "@/types/lead";

interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Lead | null;
}

const initialForm = {
  date: "",
  yangiLid: "",
  ishgaOlindi: "",
  aloqaOrnatildi: "",
  konsultatsiyaBerildi: "",
  qiziqishBildirdi: "",
  hisobRaqamYuborildi: "",
  preDaplata: "",
  toliqTolov: "",
  kotargan: "",
  kotarmagan: "",
};

export default function LeadFormModal({
  open,
  onClose,
  onSuccess,
  editData,
}: LeadFormModalProps) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (editData) {
      setForm({
        date: editData.date || "",
        yangiLid: String(editData.yangiLid ?? 0),
        ishgaOlindi: String(editData.ishgaOlindi ?? 0),
        aloqaOrnatildi: String(editData.aloqaOrnatildi ?? 0),
        konsultatsiyaBerildi: String(editData.konsultatsiyaBerildi ?? 0),
        qiziqishBildirdi: String(editData.qiziqishBildirdi ?? 0),
        hisobRaqamYuborildi: String(editData.hisobRaqamYuborildi ?? 0),
        preDaplata: String(editData.preDaplata ?? 0),
        toliqTolov: String(editData.toliqTolov ?? 0),
        kotargan: String(editData.kotargan ?? 0),
        kotarmagan: String(editData.kotarmagan ?? 0),
      });
    } else {
      setForm(initialForm);
    }
  }, [editData, open]);

  const setValue = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toNumber = (value: string) => {
    if (value === "") return 0;
    return Number(value);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorText("");

      const payload = {
        date: form.date,
        yangiLid: toNumber(form.yangiLid),
        ishgaOlindi: toNumber(form.ishgaOlindi),
        aloqaOrnatildi: toNumber(form.aloqaOrnatildi),
        konsultatsiyaBerildi: toNumber(form.konsultatsiyaBerildi),
        qiziqishBildirdi: toNumber(form.qiziqishBildirdi),
        hisobRaqamYuborildi: toNumber(form.hisobRaqamYuborildi),
        preDaplata: toNumber(form.preDaplata),
        toliqTolov: toNumber(form.toliqTolov),
        kotargan: toNumber(form.kotargan),
        kotarmagan: toNumber(form.kotarmagan),
      };

      if (editData) {
        await api.put(`/leads/${editData.id}`, payload);
      } else {
        await api.post("/leads", payload);
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
      title={editData ? "Lead statistikani tahrirlash" : "Kunlik lead qo‘shish"}
    >
      <div className="space-y-5">
        <TextInput
          label="Sana"
          type="date"
          value={form.date}
          onChange={(e) => setValue("date", e.target.value)}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <TextInput
            label="Yangi lid"
            type="number"
            value={form.yangiLid}
            onChange={(e) => setValue("yangiLid", e.target.value)}
          />
          <TextInput
            label="Ishga olindi"
            type="number"
            value={form.ishgaOlindi}
            onChange={(e) => setValue("ishgaOlindi", e.target.value)}
          />
          <TextInput
            label="Aloqa o‘rnatildi"
            type="number"
            value={form.aloqaOrnatildi}
            onChange={(e) => setValue("aloqaOrnatildi", e.target.value)}
          />
          <TextInput
            label="Konsultatsiya berildi"
            type="number"
            value={form.konsultatsiyaBerildi}
            onChange={(e) => setValue("konsultatsiyaBerildi", e.target.value)}
          />
          <TextInput
            label="Qiziqish bildirdi"
            type="number"
            value={form.qiziqishBildirdi}
            onChange={(e) => setValue("qiziqishBildirdi", e.target.value)}
          />
          <TextInput
            label="Hisob raqam yuborildi"
            type="number"
            value={form.hisobRaqamYuborildi}
            onChange={(e) => setValue("hisobRaqamYuborildi", e.target.value)}
          />
          <TextInput
            label="Pre-daplata"
            type="number"
            value={form.preDaplata}
            onChange={(e) => setValue("preDaplata", e.target.value)}
          />
          <TextInput
            label="To‘liq to‘lov"
            type="number"
            value={form.toliqTolov}
            onChange={(e) => setValue("toliqTolov", e.target.value)}
          />
          <TextInput
            label="Ko‘targan"
            type="number"
            value={form.kotargan}
            onChange={(e) => setValue("kotargan", e.target.value)}
          />
          <TextInput
            label="Ko‘tarmagan"
            type="number"
            value={form.kotarmagan}
            onChange={(e) => setValue("kotarmagan", e.target.value)}
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