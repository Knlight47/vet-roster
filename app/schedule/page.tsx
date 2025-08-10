"use client";
import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-client";
import AssignModal from "@/components/AssignModal";

const TH_MONTH = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
const DOW = ["อา","จ","อ","พ","พฤ","ศ","ส"];
const pad = (n:number)=> String(n).padStart(2,"0");
const daysInMonth = (y:number,m:number)=> new Date(y,m,0).getDate();

export default function SchedulePage(){
  const [cursor, setCursor] = useState(()=> new Date(2025,7,1)); // ส.ค. 2025
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [pickedDate, setPickedDate] = useState<string>("");

  const y = cursor.getFullYear();
  const m = cursor.getMonth()+1;
  const dim = daysInMonth(y,m);
  const firstDow = new Date(y, m-1, 1).getDay();

  const load = async ()=>{
    const sb = supabaseBrowser();
    const { data } = await sb
      .from("calendar_view")
      .select("*")
      .gte("date", `${y}-${pad(m)}-01`)
      .lte("date", `${y}-${pad(m)}-31`)
      .order("date", { ascending: true });
    setRows(data ?? []);
  };

  useEffect(()=>{ load(); }, [y,m]);

  const byDate = useMemo(()=>{
    const map: Record<string, any[]> = {};
    for (const r of rows) (map[r.date] ||= []).push(r);
    return map;
  }, [rows]);

  const cells = Array(firstDow).fill(null).concat(Array.from({length:dim},(_,i)=>i+1));
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({length: cells.length/7},(_,w)=>cells.slice(w*7,(w+1)*7));

  const onAdd = (d:number)=>{
    const dateStr = `${y}-${pad(m)}-${pad(d)}`;
    setPickedDate(dateStr);
    setOpen(true);
  };

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-bold">ตารางเวร</h1>
        <div className="flex items-center gap-2 text-sm">
          <button onClick={()=>setCursor(new Date(y,m-2,1))} className="px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50">‹</button>
          <div className="min-w-[140px] text-center">{TH_MONTH[m-1]} {y}</div>
          <button onClick={()=>setCursor(new Date(y,m,1))} className="px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50">›</button>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-3 md:p-4 shadow-sm">
        <div className="grid grid-cols-7 text-center text-slate-500 text-sm">
          {DOW.map(d=> <div key={d} className="py-2 bg-slate-50 border">{d}</div>)}
        </div>

        <div className="grid grid-cols-7 border-l border-b">
          {weeks.flat().map((d,idx)=>{
            const dateStr = d ? `${y}-${pad(m)}-${pad(d)}` : "";
            const items = d ? (byDate[dateStr] ?? []) : [];
            return (
              <div key={idx} className={`min-h-[120px] border-r border-t p-2 ${d?"bg-white":"bg-slate-50"}`}>
                {d && (
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">{d}</div>
                    {/* ปุ่ม +Assign */}
                    <button
                      onClick={()=>onAdd(d)}
                      className="text-xs px-2 py-0.5 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                      title="เพิ่มคนเข้าเวร"
                    >
                      + Assign
                    </button>
                  </div>
                )}
                {items.map((it,i)=>(
                  <div
                    key={i}
                    className={`text-xs px-2 py-1 rounded-full mb-1 flex items-center justify-between
                      ${it.shift_code==='ST_OPD' ? 'bg-blue-100 text-blue-800'
                      : it.shift_code==='ST_IPD' ? 'bg-emerald-100 text-emerald-800'
                      : it.shift_code==='ST_SUR' ? 'bg-rose-100 text-rose-800'
                      : 'bg-purple-100 text-purple-800' }`}
                  >
                    <span>{it.shift_name}</span>
                    <span className="opacity-80">{it.names || '-'}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-sm">
          <div className="font-medium mb-2">สัญลักษณ์</div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2"><span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">OPD</span><span>9:00-17:00</span></div>
            <div className="flex items-center gap-2"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs">IPD</span><span>9:00-18:00</span></div>
            <div className="flex items-center gap-2"><span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs">SUR</span><span>9:00-18:00</span></div>
            <div className="flex items-center gap-2"><span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs">Night</span><span>18:00-9:00</span></div>
          </div>
        </div>
      </div>

      <AssignModal
        open={open}
        date={pickedDate}
        onClose={()=>setOpen(false)}
        onAssigned={load}
      />
    </main>
  );
}
