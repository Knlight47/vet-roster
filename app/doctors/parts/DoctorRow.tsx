"use client";
import { useState } from "react";

export default function DoctorRow({ doctor }) {
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    email: doctor.email,
    full_name: doctor.full_name,
    short_name: doctor.short_name,
    role: doctor.role,
    doctor_group: doctor.doctor_group,
    weekly_night_quota: doctor.weekly_night_quota ?? 0,
    day_off_1: doctor.day_off_1 ?? null,
    day_off_2: doctor.day_off_2 ?? null,
    day_off_3: doctor.day_off_3 ?? null,
    not_interested_in_sur: doctor.not_interested_in_sur ?? false,
    active: doctor.active ?? true,
  });

  // เรียก API /api/doctors สำหรับ PATCH และ DELETE
  const save = async () => { /* ส่ง form */ }
  const remove = async () => { /* ยืนยันแล้วลบ */ }

  return (
    <>
      <tr>
        <td>{doctor.full_name} ({doctor.short_name})</td>
        <td>{doctor.email}</td>
        <td>{doctor.doctor_group}</td>
        <td>{doctor.role}</td>
        <td>{doctor.weekly_night_quota ?? "-"}</td>
        <td>{[doctor.day_off_1, doctor.day_off_2, doctor.day_off_3].filter(Boolean).join(", ")}</td>
        <td>{doctor.not_interested_in_sur ? "ไม่สนใจ" : "สนใจ"}</td>
        <td className="text-right space-x-2">
          <button onClick={() => setEditOpen(true)}>แก้ไข</button>
          <button onClick={remove} className="text-rose-600">ลบ</button>
        </td>
      </tr>
      {editOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center">
          <div className="bg-white w-full max-w-lg p-4 rounded-xl space-y-3">
            {/* ฟอร์มแก้ไขข้อมูลแพทย์ คล้าย AddDoctor */}
            …
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditOpen(false)}>ยกเลิก</button>
              <button onClick={save}>บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
