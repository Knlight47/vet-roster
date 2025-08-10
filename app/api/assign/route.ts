import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { date, shift_code, doctor_id } = await req.json() as {
      date: string;          // "2025-08-10"
      shift_code: "ST_OPD" | "ST_IPD" | "ST_SUR" | "ST_NGT";
      doctor_id: string;     // users.id (uuid)
    };
    if (!date || !shift_code || !doctor_id) {
      return NextResponse.json({ ok:false, error:"missing fields" }, { status:400 });
    }

    const sb = supabaseServer();

    // 1) หา shift_type + shift id สำหรับวันนั้น
    const { data: st, error: e1 } = await sb
      .from("shift_types")
      .select("id, code, min_staff, max_staff, name")
      .eq("code", shift_code)
      .single();
    if (e1 || !st) return NextResponse.json({ ok:false, error:e1?.message || "shift_type not found" }, { status:400 });

    const shiftId = `SFT_${date}_${st.code}`;

    // 2) เช็กว่ามี shift แถวนั้นหรือยัง ถ้ายังให้ upsert (status ใช้ draft/published ได้)
    await sb.from("shifts").upsert({
      id: shiftId,
      date,
      shift_type_id: st.id,
      status: "published",   // ใส่ published ไปเลยเพื่อให้ติด calendar_view
      version: 1,
    }, { onConflict: "id" });

    // 3) นับจำนวนคนในเวรนี้ปัจจุบัน
    const { data: cur, error: e2 } = await sb
      .from("assignments")
      .select("id", { count: "exact", head: true })
      .eq("shift_id", shiftId);
    if (e2) return NextResponse.json({ ok:false, error:e2.message }, { status:400 });

    const currentCount = cur?.length ?? 0; // count แบบ head:true บางเวอร์ชันคืน count ใน header แต่ตรงนี้พอใช้ length ได้
    if (currentCount >= st.max_staff) {
      return NextResponse.json({ ok:false, error:`${st.name} เต็มแล้ว (max ${st.max_staff})` }, { status:409 });
    }

    // (ไว้ค่อยเติมกฎเฉพาะ: SUR ต้อง jr+sr, NIGHT >= 1 senior ฯลฯ)

    // 4) ป้องกันใส่ซ้ำคนเดิมในเวรเดียวกัน
    const { data: dup } = await sb
      .from("assignments")
      .select("id")
      .eq("shift_id", shiftId)
      .eq("doctor_id", doctor_id)
      .maybeSingle();

    if (dup) {
      return NextResponse.json({ ok:false, error:"มีรายชื่อนี้ในเวรอยู่แล้ว" }, { status:409 });
    }

    // 5) insert
    const { error: e3 } = await sb
      .from("assignments")
      .insert({ shift_id: shiftId, doctor_id, source: "manual" });
    if (e3) return NextResponse.json({ ok:false, error:e3.message }, { status:400 });

    return NextResponse.json({ ok:true, shift_id: shiftId });
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || "unknown" }, { status:500 });
  }
}
