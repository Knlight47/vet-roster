async function loadShifts(){
  const { data: rows } = await sb
    .from("shifts")
    .select(`
      id, date, status,
      shift_types:shift_type_id ( id, code, name, min_staff, max_staff ),
      assignments:assignments (
        id,
        doctor_id,
        users:doctor_id ( id, short_name )
      )
    `)
    .gte("date", start)
    .lte("date", end)
    .order("date");
  …
}

async function removeAssign(id: string) {
  if (!confirm("แน่ใจว่าต้องการลบรายการนี้?")) return;
  await fetch("/api/assignments/delete", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ id }),
  });
  await loadShifts();
}

{/* เมื่อแสดงชื่อแพทย์ในแต่ละเวร */}
<div className="text-xs text-slate-600 mt-0.5 flex flex-wrap gap-1">
  {s.assignments && s.assignments.length > 0 ? (
    s.assignments.map((a:any) => (
      <span key={a.id} className="inline-flex items-center gap-1 border rounded px-1">
        {a.users?.short_name || "-"}
        <button onClick={() => removeAssign(a.id)} className="text-rose-500">×</button>
      </span>
    ))
  ) : (
    <span>—</span>
  )}
</div>
