"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SectionTitle from "@/components/common/SectionTitle";
import PrimaryButton from "@/components/common/PrimaryButton";
import TextInput from "@/components/common/TextInput";
import AttendanceCheckInModal from "@/components/forms/AttendanceCheckInModal";
import AttendanceCheckOutModal from "@/components/forms/AttendanceCheckOutModal";
import AttendanceTable from "@/components/tables/AttendanceTable";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Attendance } from "@/types/attendance";

export default function AttendancePage() {
  const user = getUser();

  const [rows, setRows] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");

  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const fetchRows = async () => {
    try {
      setLoading(true);

      if (isAdmin) {
        const res = await api.get<Attendance[]>("/attendance");
        setRows(res.data);
      } else {
        const res = await api.get<Attendance[]>("/attendance/me");
        setRows(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = async () => {
    if (!date) return;

    try {
      setLoading(true);

      if (isAdmin) {
        const res = await api.get<Attendance[]>(`/attendance/by-date?date=${date}`);
        setRows(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const totalLate = rows.filter((item) => item.late).length;
  const completed = rows.filter((item) => item.checkOutTime).length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <SectionTitle
          title="Attendance"
          subtitle="Keldi-ketti va selfi nazorati"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Jami yozuvlar</p>
            <h3 className="mt-2 text-2xl font-bold">{rows.length}</h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Kechikkanlar</p>
            <h3 className="mt-2 text-2xl font-bold text-red-600">{totalLate}</h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Ketganlar</p>
            <h3 className="mt-2 text-2xl font-bold text-green-600">{completed}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex-1">
              {isAdmin ? (
                <TextInput
                  label="Sana bo‘yicha filter"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              ) : (
                <div>
                  <p className="text-sm text-slate-500">Foydalanuvchi</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {user?.fullName}
                  </h3>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {isAdmin ? (
                <>
                  <PrimaryButton type="button" onClick={handleDateFilter}>
                    Sana bo‘yicha
                  </PrimaryButton>
                <button
                    onClick={fetchRows}
                    className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700"
                  >
                    Reset
                  </button>
                </>
              ) : (
                <>
                  <PrimaryButton type="button" onClick={() => setCheckInOpen(true)}>
                    Keldim
                  </PrimaryButton>

                  <PrimaryButton type="button" onClick={() => setCheckOutOpen(true)}>
                    Ketdim
                  </PrimaryButton>
                </>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-slate-500">Yuklanmoqda...</div>
        ) : (
          <AttendanceTable rows={rows} />
        )}

        <AttendanceCheckInModal
          open={checkInOpen}
          onClose={() => setCheckInOpen(false)}
          onSuccess={fetchRows}
        />

        <AttendanceCheckOutModal
          open={checkOutOpen}
          onClose={() => setCheckOutOpen(false)}
          onSuccess={fetchRows}
        />
      </div>
    </MainLayout>
  );
}