import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST() {
  const sb = supabaseAdmin();

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const date = (y:number,m:number,d:number)=>
    `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

  const { data: types, error: typesErr } =
    await sb.from("shift_types").select("id, code");
  if (typesErr || !types) return NextResponse.json(
    { ok:false, error: typesErr?.message || "no shift_types" },
    { status: 500 }
  );

  const days = new Date(y, m, 0).getDate();
  const rows:any[] = [];
  for (let d = 1; d <= days; d++) {
    for (const t of types) {
      rows.push({
        id: `SFT_${date(y,m,d)}_${t.code}`,
        date: date(y,m,d),
        shift_type_id: t.id,
        status: "draft",
        version: 1,
      });
    }
  }

  const { error } = await sb.from("shifts").upsert(rows, { onConflict: "id" });
  if (error) return NextResponse.json({ ok:false, error }, { status: 400 });

  return NextResponse.json({ ok:true, inserted: rows.length });
}
