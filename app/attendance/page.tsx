"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SectionTitle from "@/components/common/SectionTitle";
import PrimaryButton from "@/components/common/PrimaryButton";
import TextInput from "@/components/common/TextInput";
import CameraCaptureModal from "@/components/common/CameraCaptureModal";
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
  const [todayFactExists, setTodayFactExists] = useState(false);

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
    } catch (error) {
      console.error("Attendance yuklashda xatolik:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFactStatus = async () => {
    if (isAdmin) return;

    try {
      const res = await api.get("/daily-facts/me/today");
      setTodayFactExists(!!res.data);
    } catch {
      setTodayFactExists(false);
    }
  };

  const handleDateFilter = async () => {
    if (!date || !isAdmin) return;

    try {
      setLoading(true);
      const res = await api.get<Attendance[]>(`/attendance/by-date?date=${date}`);
      setRows(res.data);
    } catch (error) {
      console.error("Sana bo‘yicha attendance olishda xatolik:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
    fetchFactStatus();
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

        {!isAdmin ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Bugungi fact holati</p>
            <div className="mt-2">
              {todayFactExists ? (
                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  Fact yozilgan
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                  Fact yozilmagan
                </span>
              )}
            </div>
          </div>
        ) : null}
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

                  <PrimaryButton
                    type="button"
                    onClick={() => {
                      if (!todayFactExists) {
                        alert("Avval bugungi factni yozish kerak");
                        return;
                      }

                      setCheckOutOpen(true);
                    }}
                  >
                    Ketdim
                  </PrimaryButton>
                </>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
            Yuklanmoqda...
          </div>
        ) : (
          <AttendanceTable rows={rows} />
        )}

        <CameraCaptureModal
          open={checkInOpen}
          onClose={() => setCheckInOpen(false)}
          title="Keldim"
          onCapture={async (file) => {
            const formData = new FormData();
            formData.append("userId", String(user?.id));
            formData.append("image", file);

            await api.post("/attendance/check-in", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

            await fetchRows();
            await fetchFactStatus();
          }}
        />

        <CameraCaptureModal
          open={checkOutOpen}
          onClose={() => setCheckOutOpen(false)}
          title="Ketdim"
          onCapture={async (file) => {
            const formData = new FormData();
            formData.append("userId", String(user?.id));
            formData.append("image", file);

            await api.post("/attendance/check-out", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

            await fetchRows();
            await fetchFactStatus();
          }}
        />
      </div>
    </MainLayout>
  );
}