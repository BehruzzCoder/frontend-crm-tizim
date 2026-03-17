"use client";

import { useState } from "react";
import { Attendance } from "@/types/attendance";
import ImagePreviewModal from "@/components/common/ImagePreviewModal";
import { makeImageUrl } from "@/lib/image";

interface AttendanceTableProps {
  rows: Attendance[];
}

export default function AttendanceTable({ rows }: AttendanceTableProps) {
  const fileBase = process.env.NEXT_PUBLIC_API_URL;
  const [previewUrl, setPreviewUrl] = useState("");

  

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left">F.I.O</th>
              <th className="px-4 py-3 text-left">Sana</th>
              <th className="px-4 py-3 text-left">Kelgan vaqt</th>
              <th className="px-4 py-3 text-left">Ketgan vaqt</th>
              <th className="px-4 py-3 text-left">Kechikish</th>
              <th className="px-4 py-3 text-left">Kelgan rasm</th>
              <th className="px-4 py-3 text-left">Ketgan rasm</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="px-4 py-3 whitespace-nowrap">
                  {item.user?.fullName || "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{item.date}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {item.checkInTime || "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {item.checkOutTime || "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {item.late ? (
                    <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                      {item.lateMinutes} min
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      O‘z vaqtida
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {item.checkInImage ? (
                    <button
                      onClick={() => setPreviewUrl(makeImageUrl(item.checkInImage || ""))}
                      className="text-blue-600 underline"
                    >
                      Ko‘rish
                    </button>
                  ) : (
                    <span className="text-slate-400">Yo‘q</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {item.checkOutImage ? (
                    <button
                      onClick={() =>
                        setPreviewUrl(makeImageUrl(item.checkOutImage || ""))
                      }
                      className="text-blue-600 underline"
                    >
                      Ko‘rish
                    </button>
                  ) : (
                    <span className="text-slate-400">Yo‘q</span>
                  )}
                </td>
              </tr>
            ))}

            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  Attendance topilmadi
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <ImagePreviewModal
        open={!!previewUrl}
        imageUrl={previewUrl}
        onClose={() => setPreviewUrl("")}
      />
    </>
  );
}