"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-client";

type User = { id: string; short_name: string; doctor_group: "junior" | "senior"; not_interested_in_sur: boolean | null; active: boolean | null; };
type ShiftRow = { id: string; date: string; status: "draft" | "published"; shift_types: { id: string; code: string; name: string; min_staff: number; max_staff: number } | null; assignments: { users: { id: string; short_name: string } | null }[]; };

function daysInMonth(y:number,m:number){ return new Date(y,m,0).getDate(); }

export default function Admin() {
  // state และฟังก์ชันโหลด users/shifts เหมือนตัวอย่างใน repository…
  // ปุ่ม Auto-create month เรียก /api/admin/seed
  // ปุ่ม Publish เรียก /api/admin/publish
  // ปฏิทินแสดงเวร draft/published และ modal Assign แพทย์
  // ดูรายละเอียดเต็มในไฟล์ app/admin/page.tsx
}
