import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
export async function POST(){
  const supabase = supabaseServer();
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth()+1;
  const date = (y:number,m:number,d:number)=>`${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const { data: types, error } = await supabase.from("shift_types").select("id, code");
  if(error) return NextResponse.json({ok:false, error}, {status:500});
  if(!types || types.length===0) return NextResponse.json({ok:false, error: "No shift types"}, {status:400});
  const days = new Date(y, m, 0).getDate();
  const rows: any[] = [];
  for(let d=1; d<=days; d++){
    for(const t of types){
      rows.push({ id: `SFT_${date(y,m,d)}_${t.code}`, date: date(y,m,d), shift_type_id: t.id, status: "draft", version: 1 });
    }
  }
  const { error: upsertErr } = await supabase.from("shifts").upsert(rows, { onConflict: "id" });
  if (upsertErr) return NextResponse.json({ ok:false, error: upsertErr }, {status:500});
  return NextResponse.json({ ok:true, inserted: rows.length });
}
