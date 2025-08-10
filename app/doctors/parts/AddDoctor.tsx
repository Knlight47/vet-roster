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
    day_off_1: 1, // 1=Sun..7=Sat
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

            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">
                อีเมล
                <input
                  className="mt-1 w-full rounded border p-2"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </label>
              <label className="text-sm">
                ชื่อเต็ม
                <input
                  className="mt-1 w-full rounded border p-2"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, full_name: e.target.value }))
                  }
                />
              </label>
              <label className="text-sm">
                ชื่อย่อ
                <input
                  className="mt-1 w-full rounded border p-2"
                  value={form.short_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, short_name: e.target.value }))
                  }
                />
              </label>
              <label className="text-sm">
                บทบาท
                <select
                  className="mt-1 w-full rounded border p-2"
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, role: e.target.value }))
                  }
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </label>
              <label className="text-sm">
                กลุ่ม
                <select
                  className="mt-1 w-full rounded border p-2"
                  value={form.doctor_group}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, doctor_group: e.target.value }))
                  }
                >
                  <option value="junior">junior</option>
                  <option value="senior">senior</option>
                </select>
              </label>
              <label className="text-sm">
                โควต้า Night/สัปดาห์
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded border p-2"
                  value={form.weekly_night_quota}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      weekly_night_quota: Number(e.target.value || 0),
                    }))
                  }
                />
              </label>
              <label className="text-sm">
                วันหยุด 1 (1=อา..7=ส)
                <input
                  type="number"
                  min={1}
                  max={7}
                  className="mt-1 w-full rounded border p-2"
                  value={form.day_off_1 ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      day_off_1: Number(e.target.value),
                    }))
                  }
                />
              </label>
              <label className="text-sm">
                วันหยุด 2
                <input
                  type="number"
                  min={1}
                  max={7}
                  className="mt-1 w-full rounded border p-2"
                  value={form.day_off_2 ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      day_off_2: e.target.value
                        ? Number(e.target.value)
                        : null,
                    }))
                  }
                />
              </label>
              <label className="text-sm">
                วันหยุด 3
                <input
                  type="number"
                  min={1}
                  max={7}
                  className="mt-1 w-full rounded border p-2"
                  value={form.day_off_3 ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      day_off_3: e.target.value
                        ? Number(e.target.value)
                        : null,
                    }))
                  }
                />
              </label>
              <label className="text-sm flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  checked={form.is_junior_past_probation}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      is_junior_past_probation: e.target.checked,
                    }))
                  }
                />
                Junior ผ่านโปรแล้ว
              </label>
              <label className="text-sm flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  checked={form.not_interested_in_sur}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      not_interested_in_sur: e.target.checked,
                    }))
                  }
                />
                ไม่สนใจ SUR
              </label>
            </div>

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
