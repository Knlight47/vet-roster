export default function Admin(){
  return (
    <main className="mx-auto max-w-7xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin — Draft Roster</h1>
      <div className="flex gap-2">
        <form action="/api/admin/seed" method="post">
          <button className="px-4 py-2 rounded-xl bg-black text-white">Auto-create month</button>
        </form>
        <form action="/api/admin/publish" method="post">
          <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white">Publish</button>
        </form>
      </div>
      <div className="rounded-xl bg-white p-6 shadow">ปฏิทินร่าง (drag & drop จะเพิ่มภายหลัง)</div>
      <p className="text-sm text-slate-500">* ระบบจะเตือนกฎ: OPD ≥2, SUR = Jr+Sr, NIGHT 2–3 และมี Senior ≥1, IPD 1–2</p>
    </main>
  );
}
