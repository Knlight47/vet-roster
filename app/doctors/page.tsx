"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-client";

type Doctor = {
  id: string;
  email: string;
  full_name: string;
  short_name: string;
  role: "admin" | "user";
  doctor_group: "junior" | "senior";
  is_junior_past_probation: boolean | null;
  weekly_night_quota: number | null;
  day_off_1: number | null; // 1=Sun..7=Sat
  day_off_2: number | null;
  day_off_3: number | null;
  not_interested_in_sur: boolean | null;
  active: boolean | null;
};

const DAY = [
  { v: 1, t: "Sun" },
  { v: 2, t: "Mon" },
  { v: 3, t: "Tue" },
  { v: 4, t: "Wed" },
  { v: 5, t: "Thu" },
  { v: 6, t: "Fri" },
  { v: 7, t: "Sat" },
];

export default function DoctorsPage() {
  const sb = useMemo(() => supabaseBrowser(), []);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Doctor[]>([]);
  const [q, setQ] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [form, setForm] = useState<Partial<Doctor>>({
    role: "user",
    doctor_group: "junior",
    weekly_night_quota: 7,
    is_junior_past_probation: false,
    not_interested_in_sur: false,
    active: true,
  });
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await sb
      .from("users")
      .select(
        "id,email,full_name,short_name,role,doctor_group,is_junior_past_probation,weekly_night_quota,day_off_1,day_off_2,day_off_3,not_interested_in_sur,active"
      )
      .order("full_name", { ascending: true });
    if (!error) setRows((data || []) as Doctor[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = rows.filter(
    (r) =>
      r.full_name?.toLowerCase().includes(q.toLowerCase()) ||
      r.short_name?.toLowerCase().includes(q.toLowerCase()) ||
      r.email?.toLowerCase().includes(q.toLowerCase())
  );

  const openNew = () => {
    setEditing(null);
    setForm({
      role: "user",
      doctor_group: "junior",
      weekly_night_quota: 7,
      is_junior_past_probation: false,
      not_interested_in_sur: false,
      active: true,
    });
    setErr("");
    setOpenForm(true);
  };

  const openEdit = (d: Doctor) => {
    setEditing(d);
    setForm(d);
    setErr("");
    setOpenForm(true);
  };

  const save = async () => {
    setErr("");
    // minimal required
    if (!form.full_name || !form.short_name || !form.email) {
      setErr("กรอก Full name / Short name / Email ให้ครบ");
      return;
    }
    if (!form.doctor_group) form.doctor_group = "junior";
    if (!form.role) form.role = "user";

    if (editing) {
      const { error } = await sb.from("users").update(form).eq("id", editing.id);
      if (error) return setErr(error.message);
    } else {
      const { error } = await sb.from("users").insert(form);
      if (error) return setErr(error.message);
    }
    setOpenForm(false);
    await load();
  };

  const remove = async (d: Doctor) => {
    if (!confirm(`ลบ "${d.full_name}" ?`)) return;
    const { error } = await sb.from("users").delete().eq("id", d.id);
    if (error) alert(error.message);
    else load();
  };

  const set = (k: keyof Doctor, v: any) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-bold">จัดการข้อมูลแพทย์</h1>
        <button
          onClick={openNew}
          className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
        >
          + เพิ่มแพทย์
        </button>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm border">
        <div className="flex items-center gap-2 mb-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหา ชื่อ/ชื่อย่อ/อีเมล…"
            className="w-full md:w-80 border rounded-lg px-3 py-2"
          />
          <button
            onClick={load}
            className="px-3 py-2 rounded-lg border bg-white hover:bg-slate-50"
          >
            รีเฟรช
          </button>
        </div>

        {loading ? (
          <div className="text-slate-500">กำลังโหลด…</div>
        ) : filtered.length === 0 ? (
          <div className="text-slate-500">ไม่มีข้อมูล</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600">
                  <th className="text-left p-2 border">ชื่อ</th>
                  <th className="text-left p-2 border">ย่อ</th>
                  <th className="text-left p-2 border">อีเมล</th>
                  <th className="text-left p-2 border">กลุ่ม</th>
                  <th className="text-left p-2 border">ผ่าน Probation</th>
                  <th className="text-left p-2 border">Night Quota</th>
                  <th className="text-left p-2 border">วันหยุด</th>
                  <th className="text-left p-2 border">ไม่สนใจ SUR</th>
                  <th className="text-left p-2 border">สถานะ</th>
                  <th className="text-left p-2 border w-40">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="p-2 border">{r.full_name}</td>
                    <td className="p-2 border">{r.short_name}</td>
                    <td className="p-2 border">{r.email}</td>
                    <td className="p-2 border">{r.doctor_group}</td>
                    <td className="p-2 border">{r.is_junior_past_probation ? "Yes" : "No"}</td>
                    <td className="p-2 border">{r.weekly_night_quota ?? "-"}</td>
                    <td className="p-2 border">
                      {[r.day_off_1, r.day_off_2, r.day_off_3]
                        .filter(Boolean)
                        .map((d) => DAY.find((x) => x.v === d)?.t)
                        .join(", ")}
                    </td>
                    <td className="p-2 border">{r.not_interested_in_sur ? "Yes" : "No"}</td>
                    <td className="p-2 border">{r.active ? "Active" : "Inactive"}</td>
                    <td className="p-2 border">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(r)}
                          className="px-2 py-1 rounded bg-emerald-600 text-white"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => remove(r)}
                          className="px-2 py-1 rounded bg-rose-600 text-white"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal ฟอร์ม */}
      {openForm && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-xl">
            <div className="text-lg font-semibold mb-3">
              {editing ? "แก้ไขแพทย์" : "เพิ่มแพทย์"}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm block mb-1">Full name</label>
                <input
                  value={form.full_name || ""}
                  onChange={(e) => set("full_name", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm block mb-1">Short name</label>
                <input
                  value={form.short_name || ""}
                  onChange={(e) => set("short_name", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm block mb-1">Email (Google)</label>
                <input
                  type="email"
                  value={form.email || ""}
                  onChange={(e) => set("email", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm block mb-1">บทบาท</label>
                <select
                  value={form.role || "user"}
                  onChange={(e) => set("role", e.target.value as any)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>

              <div>
                <label className="text-sm block mb-1">กลุ่ม</label>
                <select
                  value={form.doctor_group || "junior"}
                  onChange={(e) => set("doctor_group", e.target.value as any)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="junior">junior</option>
                  <option value="senior">senior</option>
                </select>
              </div>
              <div>
                <label className="text-sm block mb-1">ผ่าน Probation (เฉพาะ Junior)</label>
                <select
                  value={String(!!form.is_junior_past_probation)}
                  onChange={(e) =>
                    set("is_junior_past_probation", e.target.value === "true")
                  }
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              <div>
                <label className="text-sm block mb-1">Night quota / สัปดาห์</label>
                <input
                  type="number"
                  min={0}
                  value={form.weekly_night_quota ?? 0}
                  onChange={(e) => set("weekly_night_quota", Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="md:col-span-2 grid grid-cols-3 gap-3">
                {[1, 2, 3].map((k, i) => (
                  <div key={k}>
                    <label className="text-sm block mb-1">{`วันหยุด ${i + 1}`}</label>
                    <select
                      value={(form as any)[`day_off_${k}`] ?? ""}
                      onChange={(e) => set(`day_off_${k}` as any, e.target.value ? Number(e.target.value) : null)}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">— ไม่ระบุ —</option>
                      {DAY.map((d) => (
                        <option key={d.v} value={d.v}>
                          {d.t}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-sm block mb-1">ไม่สนใจ SUR</label>
                <select
                  value={String(!!form.not_interested_in_sur)}
                  onChange={(e) => set("not_interested_in_sur", e.target.value === "true")}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              <div>
                <label className="text-sm block mb-1">สถานะ</label>
                <select
                  value={String(!!form.active)}
                  onChange={(e) => set("active", e.target.value === "true")}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            {err && <div className="text-rose-600 text-sm mt-2">{err}</div>}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setOpenForm(false)}
                className="px-3 py-2 rounded-lg border bg-white"
              >
                ยกเลิก
              </button>
              <button
                onClick={save}
                className="px-3 py-2 rounded-lg bg-emerald-600 text-white"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
