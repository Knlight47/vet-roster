"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-client";

type ShiftCode = "ST_OPD" | "ST_IPD" | "ST_SUR" | "ST_NGT";

export default function AssignModal({
  open, onClose, date, onAssigned
}:{
  open: boolean;
  onClose: () => void;
  date: string;             // "2025-08-10"
  onAssigned: () => void;   // callback ให้รีเฟรชตาราง
}) {
  const [users, setUsers] = useState<Array<{id:string, full_name:string, short_name:string, doctor_group:string}>>([]);
  const [shiftTypes, setShiftTypes] = useState<Array<{code:ShiftCode, name:string}>>([]);
  const [doctorId, setDoctorId] = useState("");
  const [shiftCode, setShiftCode] = useState<ShiftCode>("ST_OPD");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(()=>{
    if (!open) return;
    (async ()=>{
      const sb = supabaseBrowser();
      const { data: u } = await sb.from("users").select("id, full_name, short_name, doctor_group").eq("active", true);
      const { data: st } = await sb.from("shift_types").select("code, name").in("code", ["ST_OPD","ST_IPD","ST_SUR","ST_NGT"]);
      setUsers(u || []);
      setShiftTypes((st || []) as any);
      setDoctorId("");
      setShiftCode("ST_OPD");
      setErr("");
    })();
  }, [open]);

  const save = async ()=>{
    try{
      setLoading(true); setErr("");
      const res = await fetch("/api/assign", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ date, shift_code: shiftCode, doctor_id: doctorId })
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "บันทึกไม่สำเร็จ");
      onAssigned();
      onClose();
    }catch(e:any){
      setErr(e.message);
    }finally{
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <div className="text-lg font-semibold mb-3">เพิ่มคนเข้าเวร — {date}</div>

        <div className="space-y-3">
          <div>
            <label className="text-sm block mb-1">เลือกเวร</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={shiftCode}
              onChange={e=>setShiftCode(e.target.value as ShiftCode)}
            >
              {shiftTypes.map(st=>(
                <option key={st.code} value={st.code}>{st.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm block mb-1">เลือกแพทย์</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={doctorId}
              onChange={e=>setDoctorId(e.target.value)}
            >
              <option value="">— เลือก —</option>
              {users.map(u=>(
                <option key={u.id} value={u.id}>
                  {u.short_name ? `${u.short_name} — ${u.full_name}` : u.full_name}
                  {u.doctor_group ? ` (${u.doctor_group})` : ""}
                </option>
              ))}
            </select>
          </div>

          {err && <div className="text-sm text-rose-600">{err}</div>}

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-3 py-2 rounded-lg border bg-white">ยกเลิก</button>
            <button onClick={save} disabled={!doctorId || loading}
              className="px-3 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-50">
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
