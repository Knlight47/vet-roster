import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// กฎง่ายๆ ก่อน: จำกัดจำนวนตาม max_staff, SUR ต้อง 2 คน (และห้ามหมอที่ not_interested_in_sur),
// NIGHT ไม่เกิน 3 คน
export async function POST(req: NextRequest) {
  const { shift_id, doctor_id } = await req.json();
  if (!shift_id || !doctor_id) {
    return NextResponse.json({ ok:false, error:"missing params" }, { status: 400 });
  }

  const sb = supabaseAdmin();

  // ดึงข้อมูล shift + type + assignments ปัจจุบัน
  const { data: shiftRow, error: shiftErr } = await sb
    .from("shifts")
    .select(`
      id, date, status,
      shift_types:shift_type_id ( id, code, name, min_staff, max_staff, is_night ),
      assignments:assignments ( doctor_id ),
      specialty
    `)
    .eq("id", shift_id)
    .single();

  if (shiftErr || !shiftRow) {
    return NextResponse.json({ ok:false, error: shiftErr?.message || "shift not found" }, { status: 400 });
  }

  // ดึงข้อมูลแพทย์
  const { data: userRow, error: userErr } = await sb
    .from("users")
    .select("id, short_name, doctor_group, not_interested_in_sur, active")
    .eq("id", doctor_id)
    .single();
  if (userErr || !userRow) {
    return NextResponse.json({ ok:false, error: userErr?.message || "user not found" }, { status: 400 });
  }
  if (userRow.active === false) {
    return NextResponse.json({ ok:false, error: "บัญชีถูกปิดใช้งาน" }, { status: 400 });
  }

  const type = shiftRow.shift_types;
  const currentDoctorIds: string[] = (shiftRow.assignments || []).map((a:any)=>a.doctor_id);
  const already = currentDoctorIds.includes(doctor_id);
  if (already) {
    return NextResponse.json({ ok:false, error: "คนนี้ถูกลงเวรนี้อยู่แล้ว" }, { status: 400 });
  }

  // RULE 1: max_staff
  const currentCount = currentDoctorIds.length;
  if (type?.max_staff && currentCount >= type.max_staff) {
    return NextResponse.json({ ok:false, error: `เกินจำนวนสูงสุดของเวร (${type.max_staff})` }, { status: 400 });
  }

  // RULE 2: SUR ต้อง 2 คน และห้ามคนที่ติ๊ก not_interested_in_sur
  if (type?.code === "ST_SUR") {
    if (userRow.not_interested_in_sur) {
      return NextResponse.json({ ok:false, error:"แพทย์คนนี้ไม่รับเวร SUR" }, { status: 400 });
    }
    if (type.max_staff && currentCount + 1 > type.max_staff) {
      return NextResponse.json({ ok:false, error:`SUR ต้อง 2 คนเท่านั้น` }, { status: 400 });
    }
  }

  // RULE 3: NIGHT ไม่เกิน 3
  if (type?.code === "ST_NGT" && type.max_staff && currentCount + 1 > type.max_staff) {
    return NextResponse.json({ ok:false, error:"เวร NIGHT จำกัด 2–3 คนตามที่ตั้งค่า" }, { status: 400 });
  }

  // (สามารถต่อยอด: เช็ค day_off, โควตา night, Jr/Sr combination ฯลฯ)

  // ผ่าน validation → insert
  const { error: insErr } = await sb.from("assignments").insert({
    shift_id,
    doctor_id,
    source: "manual"
  });

  if (insErr) {
    return NextResponse.json({ ok:false, error: insErr.message }, { status: 400 });
  }

  return NextResponse.json({ ok:true });
}
