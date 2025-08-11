"use client";
import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-client";

type CoverageRow = { shift_code: string; shift_name: string; shifts: number; required: number; assigned: number; coverage: number; };
type NightRow = { doctor_id: string; short_name: string; group_name: "junior" | "senior"; nights: number; quota: number; over_quota: number; };

function monthBounds(d: Date) {
  const y = d.getFullYear(); const m = d.getMonth();
  const start = new Date(y, m, 1); const end = new Date(y, m + 1, 0);
  const fmt = (x: Date) => `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}-${String(x.getDate()).padStart(2,"0")}`;
  return { start: fmt(start), end: fmt(end) };
}

export default function ReportsPage() {
  const sb = useMemo(() => supabaseBrowser(), []);
  const [cursor, setCursor] = useState(() => new Date());
  const [cov, setCov] = useState<CoverageRow[]>([]);
  const [night, setNight] = useState<NightRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { start, end } = monthBounds(cursor);
    const { data: covData } = await sb.rpc("report_shift_coverage", { p_start: start, p_end: end });
    const { data: nightData } = await sb.rpc("report_night_distribution", { p_start: start, p_end: end });
    if (covData) setCov(covData as CoverageRow[]);
    if (nightData) setNight(nightData as NightRow[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, [cursor]);

  // คำนวณตัวเลข summary และ render กราฟ/ตารางตามตัวอย่างใน repository…
}
