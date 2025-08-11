// app/doctors/parts/AddDoctor.tsx
"use client";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

export default function AddDoctor() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    short_name: "",
    role: "user",
    doctor_group: "junior",
    weekly_night_quota: 7,
    day_off_1: 1,
    day_off_2: null as number | null,
    day_off_3: null as number | null,
    not_interested_in_sur: false,
    is_junior_past_probation: false,
  });

  const save = async () => {
    const sb = supabase();
    const { error } = await sb.from("users").insert(form as any);
    if (error) {
      alert("บันทึกไม่สำเร็จ: " + error.message);
      return;
    }
    setOpen(false);
    location.reload();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1.5 rounded bg-emerald-600 text-white text-sm"
      >
        + เพิ่มแพทย์
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center p-4 z-50">
          <div className="w-full max-w-lg rounded-xl bg-white p-4 space-y-3">
            <div className="text-lg font-semibold">เพิ่มแพทย์</div>
            {/* …ฟอร์ม input ต่าง ๆ ตามตัวอย่าง… */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 rounded border"
              >
                ยกเลิก
              </button>
              <button
                onClick={save}
                className="px-3 py-1.5 rounded bg-emerald-600 text-white"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
