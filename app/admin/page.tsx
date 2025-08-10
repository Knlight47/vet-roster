"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-client";

type User = {
  id: string;
  short_name: string;
  doctor_group: "junior" | "senior";
  not_interested_in_sur: boolean | null;
  active: boolean | null;
};

type ShiftRow = {
  id: string;        // shifts.id
  date: string;      // YYYY-MM-DD
  status: "draft" | "published";
  shift_types: { id: string; code: string; name: string; min_staff: number; max_staff: number } | null;
  assignments: { users: { id: string; short_name: string } | null }[];
};

function daysInMonth(y:number,m:number){ return new Date(y,m,0).getDate(); }

export default function Admin() {
  const [cursor, setCursor] = useState(()=>{ const d=new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [users, setUsers] = useState<User[]>([]);
  const [data, setData] = useState<Record<string, ShiftRow[]>>({});
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [modalDate, setModalDate] = useState<string>("");
  const [modalShiftId, setModalShiftId] = useState<string>("");
  const [modalDoctorId, setModalDoctorId] = useState<string>("");

  const y = cursor.getFullYear();
  const m = cursor.getMonth()+1;
  const dim = daysInMonth(y,m);
  const first = new Date(y, m-1, 1).getDay(); // 0=Sun

  const monthTH = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"][m-1];
  const dow = ["อา","จ","อ","พ","พฤ","ศ","ส"];

  const cells = useMemo(()=>{
    const arr = Array(first).fill(null).concat(Array.from({length:dim},(_,i)=>i+1));
    while(arr.length % 7 !== 0) arr.push(null);
    return arr;
  },[first, dim]);

  const sb = supabaseBrowser();

  async function loadUsers(){
    const { data, error } = await sb
      .from("users")
      .select("id, short_name, doctor_group, not_interested_in_sur, active")
      .eq("active", true)
      .order("short_name");
    if (!error && data) setUsers(data as any);
  }

  async function loadShifts(){
    setLoading(true);
    const start = `${y}-${String(m).padStart(2,"0")}-01`;
    const end   = `${y}-${String(m).padStart(2,"0")}-31`;

    const { data: rows, error } = await sb
      .from("shifts")
      .select(`
        id, date, status,
        shift_types:shift_type_id ( id, code, name, min_staff, max_staff ),
        assignments:assignments (
          users:doctor_id ( id, short_name )
        )
      `)
      .gte("date", start)
      .lte("date", end)
      .order("date");
    if (error) { console.error(error); setLoading(false); return; }

    const byDate: Record<string, ShiftRow[]> = {};
    for(const r of rows as any[]){
      if (!byDate[r.date]) byDate[r.date] = [];
      byDate[r.date].push(r);
    }
    setData(byDate);
    setLoading(false);
  }

  useEffect(()=>{ loadUsers(); },[]);
  useEffect(()=>{ loadShifts(); },[y,m]);

  const badge = (code?:string) => {
    const base = "px-2 py-0.5 rounded-full text-xs";
    if (!code) return base;
    if (code === "ST_OPD") return `${base} bg-blue-100 text-blue-800`;
    if (code === "ST_IPD") return `${base} bg-emerald-100 text-emerald-800`;
    if (code === "ST_SUR") return `${base} bg-rose-100 text-rose-800`;
    if (code === "ST_NGT") return `${base} bg-purple-100 text-purple-800`;
    return `${base} bg-slate-100`;
  };

  function openAssign(dateStr:string, shiftId:string){
    setModalDate(dateStr);
    setModalShiftId(shiftId);
    setModalDoctorId("");
    setOpen(true);
  }

  async function submitAssign(){
    if (!modalShiftId || !modalDoctorId) return;
    const res = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ shift_id: modalShiftId, doctor_id: modalDoctorId })
    });
    const json = await res.json();
    if (!json.ok) {
      alert(`บันทึกไม่สำเร็จ: ${json.error?.message || json.error || "unknown"}`);
    } else {
      setOpen(false);
      await loadShifts();
    }
  }

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-3">Admin — Draft Roster</h1>

      <div className="flex gap-2 mb-4">
        <form action="/api/admin/seed" method="post">
          <button className="px-4 py-2 rounded-xl bg-black text-white">Auto-create month</button>
        </form>
        <form action="/api/admin/publish" method="post">
          <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white">Publish</button>
        </form>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <button onClick={()=>setCursor(new Date(y,m-2,1))} className="px-2 py-1 rounded border">‹</button>
          <div className="min-w-[140px] text-center">{monthTH} {y}</div>
          <button onClick={()=>setCursor(new Date(y,m,1))} className="px-2 py-1 rounded border">›</button>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-3 md:p-4 shadow-sm">
        <div className="grid grid-cols-7 text-center text-slate-500 text-sm">
          {dow.map(d=> <div key={d} className="py-2 bg-slate-50 border">{d}</div>)}
        </div>

        <div className="grid grid-cols-7 border-l border-b">
          {cells.map((d,idx)=>{
            const dateStr = d ? `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}` : "";
            const dayShifts = d ? (data[dateStr] || []) : [];
            return (
              <div key={idx} className={`min-h-[140px] border-r border-t p-2 ${d?"bg-white":"bg-slate-50"}`}>
                {d && <div className="text-sm font-medium mb-1">{d}</div>}
                {d && loading && <div className="text-xs text-slate-400">กำลังโหลด…</div>}
                {d && !loading && dayShifts.map(s=>(
                  <div key={s.id} className="mb-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className={badge(s.shift_types?.code)}>
                        {s.shift_types?.name || "-"} {s.status==="draft" && <span className="ml-1 text-[10px] text-slate-500">(draft)</span>}
                      </div>
                      <button
                        className="text-xs px-2 py-0.5 rounded border hover:bg-slate-50"
                        onClick={()=>openAssign(dateStr, s.id)}
                      >
                        +Assign
                      </button>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {s.assignments?.map(a=>a.users?.short_name).filter(Boolean).join(", ") || "—"}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-500 mt-3">
          * กฎเบื้องต้นที่เช็กฝั่งเซิร์ฟเวอร์ตอนบันทึก: จำกัดจำนวนตาม max_staff, SUR ต้อง 2 คน, Night ไม่เกิน 3 คน และห้ามหมอที่ติ๊ก “ไม่สนใจ SUR” ถูกใส่ใน SUR
        </p>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-4">
            <div className="text-lg font-semibold mb-2">Assign แพทย์</div>
            <div className="text-sm text-slate-500 mb-3">วันที่: {modalDate}</div>
            <label className="text-sm block mb-1">เลือกแพทย์</label>
            <select
              value={modalDoctorId}
              onChange={(e)=>setModalDoctorId(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
            >
              <option value="">-- เลือก --</option>
              {users.map(u=>(
                <option key={u.id} value={u.id}>
                  {u.short_name} ({u.doctor_group})
                  {u.not_interested_in_sur ? " • ไม่รับ SUR" : ""}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded border" onClick={()=>setOpen(false)}>ยกเลิก</button>
              <button
                className="px-4 py-2 rounded bg-emerald-600 text-white"
                disabled={!modalDoctorId}
                onClick={submitAssign}
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
