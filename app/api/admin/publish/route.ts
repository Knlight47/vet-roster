import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
export async function POST(){
  const supabase = supabaseServer();
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth()+1;
  const start = `${y}-${String(m).padStart(2,"0")}-01`;
  const end = `${y}-${String(m).padStart(2,"0")}-31`;
  const { error } = await supabase.rpc("publish_month", { p_start: start, p_end: end });
  if (error) return NextResponse.json({ ok:false, error }, {status:500});
  return NextResponse.json({ ok:true });
}
