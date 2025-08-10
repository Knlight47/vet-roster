export default function DashboardPage(){
  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white p-4 shadow-sm border"><div className="text-slate-500 text-sm">สัตวแพทย์ทั้งหมด</div><div className="text-2xl font-semibold text-emerald-700 mt-1">12</div><div className="text-xs text-slate-400">Junior: 7, Senior: 5</div></div>
        <div className="rounded-xl bg-white p-4 shadow-sm border"><div className="text-slate-500 text-sm">เวรที่ทำงานอยู่</div><div className="text-2xl font-semibold text-emerald-700 mt-1">8</div><div className="text-xs text-slate-400">ขณะนี้</div></div>
        <div className="rounded-xl bg-white p-4 shadow-sm border"><div className="text-slate-500 text-sm">คำขอรอดำเนินการ</div><div className="text-2xl font-semibold text-yellow-600 mt-1">5</div><div className="text-xs text-slate-400">ต้องอนุมัติ</div></div>
        <div className="rounded-xl bg-white p-4 shadow-sm border"><div className="text-slate-500 text-sm">Coverage Rate</div><div className="text-2xl font-semibold text-green-600 mt-1">95%</div><div className="text-xs text-slate-400">เดือนนี้</div></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="rounded-xl bg-white p-4 shadow-sm border">
          <div className="font-medium mb-3">ต้องดำเนินการ</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-3 rounded-lg bg-yellow-50 border border-yellow-100"><span>คำขอสลับเวร - นสพ.สมชาย</span><span className="text-xs px-2 py-0.5 rounded-full bg-yellow-200">รอดำเนินการ</span></div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-red-50 border border-red-100"><span>เวร Night ขาดคน (25/12)</span><span className="text-xs px-2 py-0.5 rounded-full bg-red-200">เร่งด่วน</span></div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50 border border-blue-100"><span>ตรวจสอบ OT เดือนนี้</span><span className="text-xs px-2 py-0.5 rounded-full bg-blue-200">ปกติ</span></div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm border">
          <div className="font-medium mb-3">การกระจายเวรเดือนนี้</div>
          <div className="space-y-3 text-sm">
            <div>
              <div className="flex justify-between mb-1"><span>OPD Coverage</span><span>92%</span></div>
              <div className="h-2 bg-slate-200 rounded"><div className="h-2 bg-emerald-600 rounded" style={{width:'92%'}} /></div>
            </div>
            <div>
              <div className="flex justify-between mb-1"><span>Night Shift Coverage</span><span>88%</span></div>
              <div className="h-2 bg-slate-200 rounded"><div className="h-2 bg-emerald-600 rounded" style={{width:'88%'}} /></div>
            </div>
            <div>
              <div className="flex justify-between mb-1"><span>SUR Coverage</span><span>95%</span></div>
              <div className="h-2 bg-slate-200 rounded"><div className="h-2 bg-emerald-600 rounded" style={{width:'95%'}} /></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
