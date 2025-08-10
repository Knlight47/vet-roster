"use client";
import { useMemo, useState } from "react";

function daysInMonth(year:number, month:number){
  return new Date(year, month, 0).getDate();
}

export default function SchedulePage(){
  const [cursor, setCursor] = useState(()=>{ const d=new Date(); return new Date(d.getFullYear(),7,1); }); // Aug as default UI
  const y = cursor.getFullYear();
  const m = cursor.getMonth()+1; // 1-12
  const dim = daysInMonth(y,m);
  const first = new Date(y, m-1, 1).getDay(); // 0=Sun
  const weeks = useMemo(()=>{
    const cells = Array(first).fill(null).concat(Array.from({length:dim},(_,i)=>i+1));
    while(cells.length % 7 !== 0) cells.push(null);
    return Array.from({length: cells.length/7},(_,w)=>cells.slice(w*7,(w+1)*7));
  },[first, dim]);

  const monthTH = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"][m-1];
  const dow = ["อา","จ","อ","พ","พฤ","ศ","ส"];

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
          {weeks.flat().map((d,idx)=> (
            <div key={idx} className={`min-h-[94px] border-r border-t p-2 ${d?"bg-white":"bg-slate-50"}`}>
              {d && <div className="text-sm font-medium">{d}</div>}
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm">
          <div className="font-medium mb-2">สัญลักษณ์</div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2"><span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">OPD</span><span>9:00-17:00</span></div>
            <div className="flex items-center gap-2"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs">IPD</span><span>9:00-18:00</span></div>
            <div className="flex items-center gap-2"><span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs">SUR</span><span>9:00-18:00</span></div>
            <div className="flex items-center gap-2"><span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs">Night</span><span>18:00-9:00</span></div>
            <div className="flex items-center gap-2"><span className="text-yellow-500">★</span><span>เวรพิเศษ *</span></div>
          </div>
        </div>
      </div>
    </main>
  );
}
