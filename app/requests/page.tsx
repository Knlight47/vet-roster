export default function RequestsPage(){
  const items = [
    { id:1, type:"สลับเวร", date:"2024-12-20", who:"นสพ.สมชาย วิรุฬห์", status:"รอดำเนินการ", note:"ขอสลับเวร Night 20/12" },
    { id:2, type:"ขอวันหยุด", date:"2024-12-15", who:"นสพ.สมศรี ใจดี", status:"อนุมัติ", note:"ลาป่วย" },
    { id:3, type:"ขอเวรพิเศษ", date:"2024-12-25", who:"นสพ.สมศักดิ์ รักสัตว์", status:"ปฏิเสธ", note:"ขอเพิ่ม OT" },
  ];
  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4">จัดการคำร้องขอ</h1>
      <div className="space-y-3">
        {items.map(it=> (
          <div key={it.id} className="rounded-xl bg-white p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="text-lg font-medium">{it.type}</div>
              <div className="text-xs px-2 py-0.5 rounded-full bg-slate-100">{it.date}</div>
            </div>
            <div className="text-sm text-slate-600 mt-1">ผู้ขอ: {it.who}</div>
            <div className="text-sm text-slate-600">เหตุผล: {it.note}</div>
            <div className="mt-3 flex items-center gap-2">
              <button className="px-3 py-1 rounded bg-emerald-600 text-white text-sm">อนุมัติ</button>
              <button className="px-3 py-1 rounded bg-rose-600 text-white text-sm">ปฏิเสธ</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
