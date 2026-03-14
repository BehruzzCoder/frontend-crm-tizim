 "use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AlertBox from "@/components/common/AlertBox";
import PrimaryButton from "@/components/common/PrimaryButton";

type LeadFormData = {
  date: string;
  yangiLid: string;
  ishgaOlindi: string;
  aloqaOrnatildi: string;
  konsultatsiyaBerildi: string;
  qiziqishBildirdi: string;
  hisobRaqamYuborildi: string;
  preDaplata: string;
  toliqTolov: string;
  kotargan: string;
  kotarmagan: string;
};

const initialState: LeadFormData = {
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

interface EditLeadData {
  id: number;
  date: string;
  yangiLid: number;
  ishgaOlindi: number;
  aloqaOrnatildi: number;
  konsultatsiyaBerildi: number;
  qiziqishBildirdi: number;
  hisobRaqamYuborildi: number;
  preDaplata: number;
  toliqTolov: number;
  kotargan: number;
  kotarmagan: number;
}

interface Props {
  onSuccess?: () => void;
  editData?: EditLeadData | null;
  onCancelEdit?: () => void;
}

export default function LeadStatForm({
  onSuccess,
  editData,
  onCancelEdit,
}: Props) {
  const [form, setForm] = useState<LeadFormData>(initialState);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (editData) {
      setForm({
        date: editData.date,
        yangiLid: String(editData.yangiLid),
        ishgaOlindi: String(editData.ishgaOlindi),
        aloqaOrnatildi: String(editData.aloqaOrnatildi),
        konsultatsiyaBerildi: String(editData.konsultatsiyaBerildi),
        qiziqishBildirdi: String(editData.qiziqishBildirdi),
        hisobRaqamYuborildi: String(editData.hisobRaqamYuborildi),
        preDaplata: String(editData.preDaplata),
        toliqTolov: String(editData.toliqTolov),
        kotargan: String(editData.kotargan),
        kotarmagan: String(editData.kotarmagan),
      });
    } else {
      setForm(initialState);
    }
  }, [editData]);

  const handleChange = (key: keyof LeadFormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const buildPayload = () => ({
    date: form.date,
    yangiLid: Number(form.yangiLid || 0),
    ishgaOlindi: Number(form.ishgaOlindi || 0),
    aloqaOrnatildi: Number(form.aloqaOrnatildi || 0),
    konsultatsiyaBerildi: Number(form.konsultatsiyaBerildi || 0),
    qiziqishBildirdi: Number(form.qiziqishBildirdi || 0),
    hisobRaqamYuborildi: Number(form.hisobRaqamYuborildi || 0),
    preDaplata: Number(form.preDaplata || 0),
    toliqTolov: Number(form.toliqTolov || 0),
    kotargan: Number(form.kotargan || 0),
    kotarmagan: Number(form.kotarmagan || 0),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload = buildPayload();

      if (editData?.id) {
        await api.put(`/leads/${editData.id}`, payload);
        setSuccessMessage("Statistika muvaffaqiyatli yangilandi");
      } else {
        await api.post("/leads", payload);
        setSuccessMessage("Statistika muvaffaqiyatli saqlandi");
      }

      setForm(initialState);
      onSuccess?.();
    } catch (error) {
      setErrorMessage("Saqlashda xatolik yuz berdi");
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
          {editData ? "Statistikani tahrirlash" : "Kunlik lid statistikasi qo‘shish"}
        </h2>
[3/11/26 2:41 AM] Mirbosidov Behruz Meneger: {editData && (
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

      <div>
        <label className="mb-1 block text-sm text-slate-600">Sana</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => handleChange("date", e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <InputNumber label="Yangi lid" value={form.yangiLid} onChange={(v) => handleChange("yangiLid", v)} />
        <InputNumber label="Ishga olindi" value={form.ishgaOlindi} onChange={(v) => handleChange("ishgaOlindi", v)} />
        <InputNumber label="Aloqa o‘rnatildi" value={form.aloqaOrnatildi} onChange={(v) => handleChange("aloqaOrnatildi", v)} />
        <InputNumber label="Konsultatsiya berildi" value={form.konsultatsiyaBerildi} onChange={(v) => handleChange("konsultatsiyaBerildi", v)} />
        <InputNumber label="Qiziqish bildirdi" value={form.qiziqishBildirdi} onChange={(v) => handleChange("qiziqishBildirdi", v)} />
        <InputNumber label="Hisob raqam yuborildi" value={form.hisobRaqamYuborildi} onChange={(v) => handleChange("hisobRaqamYuborildi", v)} />
        <InputNumber label="Pre-daplata" value={form.preDaplata} onChange={(v) => handleChange("preDaplata", v)} />
        <InputNumber label="To‘liq to‘lov" value={form.toliqTolov} onChange={(v) => handleChange("toliqTolov", v)} />
        <InputNumber label="Ko‘targan" value={form.kotargan} onChange={(v) => handleChange("kotargan", v)} />
        <InputNumber label="Ko‘tarmagan" value={form.kotarmagan} onChange={(v) => handleChange("kotarmagan", v)} />
      </div>

      <PrimaryButton type="submit" disabled={loading}>
        {loading ? "Saqlanmoqda..." : editData ? "Yangilash" : "Saqlash"}
      </PrimaryButton>
    </form>
  );
}

function InputNumber({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-slate-600">{label}</label>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
      />
    </div>
  );
} 