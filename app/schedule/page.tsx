"use client";
import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-client";

type ShiftRow = {
  id: string;
  date: string;
  shift_types: { code: string; name: string } | null;
  assignments: { users: { short_name: string } | null }[];
};

function daysInMonth(y:number,m:number){ return new Date(y,m,0).getDate(); }

export default function SchedulePage(){
  // default เปิดเดือนปัจจุบัน
  const [cursor, setCursor] = useState(()=>{ const d=new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [data, setData] = useState<Record<string, ShiftRow[]>>({}); // key = YYYY-MM-DD
  const [loading, setLoading] = useState(false);

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

  const load = async () => {
    setLoading(true);
    const sb = supabaseBrowser();
    const start = `${y}-${String(m).padStart(2,"0")}-01`;
    const end   = `${y}-${String(m).padStart(2,"0")}-31`;

    // ดึง shifts ที่ publish แล้ว + assignments + ชื่อย่อหมอ
    const { data: rows, error } = await sb
      .from("shifts")
      .select(`
        id, date,
        shift_types:shift_type_id ( code, name ),
        assignments:assignments (
          users:doctor_id ( short_name )
        )
      `)
      .gte("date", start)
      .lte("date", end)
      .eq("status","published")
      .order("date");

    if (error) { console.error(error); setLoading(false); return; }

    const byDate: Record<string, ShiftRow[]> = {};
    for (const r of (rows as any[])) {
      if (!byDate[r.date]) byDate[r.date] = [];
      byDate[r.date].push(r);
    }
    setData(byDate);
    setLoading(false);
  };

  useEffect(()=>{ load(); /* reload เมื่อเลื่อนเดือน */ },[y,m]);

  const badge = (code?:string) => {
    const base = "px-2 py-0.5 rounded-full text-xs";
    if (!code) return base;
    if (code === "ST_OPD") return `${base} bg-blue-100 text-blue-800`;
    if (code === "ST_IPD") return `${base} bg-emerald-100 text-emerald-800`;
    if (code === "ST_SUR") return `${base} bg-rose-100 text-rose-800`;
    if (code === "ST_NGT") return `${base} bg-purple-100 text-purple-800`;
    return `${base} bg-slate-100`;
  };

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl md:text-2xl font-bold">ตารางเวร</h1>
        <div className="flex items-center gap-2 text-sm">
          <button onClick={()=>setCursor(new Date(y,m-2,1))} className="px-2 py-1 rounded border">‹</button>
          <div className="min-w-[120px] text-center">{monthTH} {y}</div>
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
              <div key={idx} className={`min-h-[110px] border-r border-t p-2 ${d?"bg-white":"bg-slate-50"}`}>
                {d && <div className="text-sm font-medium mb-1">{d}</div>}
                {d && loading && <div className="text-xs text-slate-400">กำลังโหลด…</div>}
                {d && !loading && dayShifts.map(s=>(
                  <div key={s.id} className="mb-1">
                    <div className={badge(s.shift_types?.code)}>
                      {s.shift_types?.name || "-"}
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
      </div>
    </main>
  );
}
