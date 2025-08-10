import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
export async function POST(req: NextRequest){
  const body = await req.json(); // { shift_id, doctor_id }
  const supabase = supabaseServer();
  const { error } = await supabase.from("assignments").insert({ shift_id: body.shift_id, doctor_id: body.doctor_id });
  if (error) return NextResponse.json({ ok:false, error }, {status:400});
  return NextResponse.json({ ok:true });
}
