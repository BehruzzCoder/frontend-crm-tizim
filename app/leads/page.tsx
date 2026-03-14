"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SectionTitle from "@/components/common/SectionTitle";
import PrimaryButton from "@/components/common/PrimaryButton";
import TextInput from "@/components/common/TextInput";
import LeadFormModal from "@/components/forms/LeadFormModal";
import LeadsTable from "@/components/tables/LeadsTable";
import { api } from "@/lib/api";
import { Lead, LeadSummary } from "@/types/lead";

const emptySummary: LeadSummary = {
  jamiLid: 0,
  yangiLid: 0,
  ishgaOlindi: 0,
  aloqaOrnatildi: 0,
  konsultatsiyaBerildi: 0,
  qiziqishBildirdi: 0,
  hisobRaqamYuborildi: 0,
  preDaplata: 0,
  toliqTolov: 0,
  kotargan: 0,
  kotarmagan: 0,
};

export default function LeadsPage() {
  const [rows, setRows] = useState<Lead[]>([]);
  const [summary, setSummary] = useState<LeadSummary>(emptySummary);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);

  const [singleDate, setSingleDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const calcSummary = (items: Lead[]): LeadSummary => {
    return {
      jamiLid: items.reduce((s, i) => s + i.yangiLid, 0),
      yangiLid: items.reduce((s, i) => s + i.yangiLid, 0),
      ishgaOlindi: items.reduce((s, i) => s + i.ishgaOlindi, 0),
      aloqaOrnatildi: items.reduce((s, i) => s + i.aloqaOrnatildi, 0),
      konsultatsiyaBerildi: items.reduce((s, i) => s + i.konsultatsiyaBerildi, 0),
      qiziqishBildirdi: items.reduce((s, i) => s + i.qiziqishBildirdi, 0),
      hisobRaqamYuborildi: items.reduce((s, i) => s + i.hisobRaqamYuborildi, 0),
      preDaplata: items.reduce((s, i) => s + i.preDaplata, 0),
      toliqTolov: items.reduce((s, i) => s + i.toliqTolov, 0),
      kotargan: items.reduce((s, i) => s + i.kotargan, 0),
      kotarmagan: items.reduce((s, i) => s + i.kotarmagan, 0),
    };
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [rowsRes, summaryRes] = await Promise.all([
        api.get<Lead[]>("/leads"),
        api.get<LeadSummary>("/leads/summary"),
      ]);

      setRows(rowsRes.data);
      setSummary(summaryRes.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByDate = async () => {
    if (!singleDate) return;

    try {
      setLoading(true);
      const res = await api.get<Lead>(`/leads/by-date?date=${singleDate}`);
      const data = [res.data];
      setRows(data);
      setSummary(calcSummary(data));
    } catch {
      setRows([]);
      setSummary(emptySummary);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByRange = async () => {
    if (!fromDate || !toDate) return;

    try {
      setLoading(true);
      const res = await api.get<Lead[]>(
        `/leads/range?from=${fromDate}&to=${toDate}`
      );
      setRows(res.data);
      setSummary(calcSummary(res.data));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/leads/${id}`);
    fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionTitle
          title="Lead statistikasi"
          subtitle="Kunlik sonlarni modal orqali kiriting va tahrirlang"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Jami lid</p>
            <h3 className="mt-2 text-2xl font-bold">{summary.jamiLid}</h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Ishga olindi</p>
            <h3 className="mt-2 text-2xl font-bold">{summary.ishgaOlindi}</h3>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">To‘liq to‘lov</p>
            <h3 className="mt-2 text-2xl font-bold">{summary.toliqTolov}</h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Ko‘tarmagan</p>
            <h3 className="mt-2 text-2xl font-bold">{summary.kotarmagan}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
              <TextInput
                label="Bitta sana"
                type="date"
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
              />

              <TextInput
                label="Dan"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />

              <TextInput
                label="Gacha"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <PrimaryButton type="button" onClick={handleSearchByDate}>
                Sana bo‘yicha
              </PrimaryButton>

              <PrimaryButton type="button" onClick={handleSearchByRange}>
                Range bo‘yicha
              </PrimaryButton>

              <button
                onClick={fetchAll}
                className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700"
              >
                Reset
              </button>

              <PrimaryButton
                type="button"
                onClick={() => {
                  setEditLead(null);
                  setModalOpen(true);
                }}
              >
                Kunlik statistika qo‘shish
              </PrimaryButton>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-slate-500">Yuklanmoqda...</div>
        ) : (
          <LeadsTable
            rows={rows}
            onEdit={(lead) => {
              setEditLead(lead);
              setModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        )}

        <LeadFormModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditLead(null);
          }}
          onSuccess={fetchAll}
          editData={editLead}
        />
      </div>
    </MainLayout>
  );
}