"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-client";

type CoverageRow = {
  shift_code: string;
  shift_name: string;
  shifts: number;
  required: number;
  assigned: number;
  coverage: number; // %
};

type NightRow = {
  doctor_id: string;
  short_name: string;
  group_name: "junior" | "senior";
  nights: number;
  quota: number;
  over_quota: number;
};

function monthBounds(d: Date) {
  const y = d.getFullYear();
  const m = d.getMonth();
  const start = new Date(y, m, 1);
  const end = new Date(y, m + 1, 0);
  const fmt = (x: Date) =>
    `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(
      x.getDate()
    ).padStart(2, "0")}`;
  return { start: fmt(start), end: fmt(end) };
}

export default function ReportsPage() {
  const sb = useMemo(() => supabaseBrowser(), []);
  const [cursor, setCursor] = useState(() => new Date());
  const [cov, setCov] = useState<CoverageRow[]>([]);
  const [night, setNight] = useState<NightRow[]>([]);
  const [loading, setLoading] = useState(true);

  const y = cursor.getFullYear();
  const m = cursor.getMonth(); // 0-11
  const monthTH = [
    "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
    "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม",
  ][m];

  async function load() {
    setLoading(true);
    const { start, end } = monthBounds(cursor);

    const { data: covData, error: e1 } = await sb.rpc("report_shift_coverage", {
      p_start: start,
      p_end: end,
    });
    const { data: nightData, error: e2 } = await sb.rpc(
      "report_night_distribution",
      { p_start: start, p_end: end }
    );

    if (!e1 && covData) setCov(covData as CoverageRow[]);
    if (!e2 && nightData) setNight(nightData as NightRow[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor]);

  const totalRequired = cov.reduce((s, r) => s + r.required, 0);
  const totalAssigned = cov.reduce((s, r) => s + r.assigned, 0);
  const overallCoverage =
    totalRequired === 0 ? 0 : Math.round((totalAssigned * 100) / totalRequired);

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">รายงานและสถิติ</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCursor(new Date(y, m - 1, 1))}
            className="px-2 py-1 rounded border"
          >
            ‹
          </button>
          <div className="min-w-[140px] text-center">
            {monthTH} {y}
          </div>
          <button
            onClick={() => setCursor(new Date(y, m + 1, 1))}
            className="px-2 py-1 rounded border"
          >
            ›
          </button>
        </div>
      </div>

      {/* แผงสรุปบนสุด */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="rounded-xl bg-white p-4 shadow-sm border">
          <div className="text-slate-500 text-sm">Coverage รวม</div>
          <div className="text-2xl font-semibold text-emerald-700 mt-1">
            {overallCoverage}%
          </div>
          <div className="text-xs text-slate-400">
            จัดได้ {totalAssigned} / ต้องการ {totalRequired}
          </div>
          <div className="h-2 bg-slate-200 rounded mt-2">
            <div
              className="h-2 bg-emerald-600 rounded"
              style={{ width: `${overallCoverage}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm border">
          <div className="text-slate-500 text-sm">เวรทั้งหมด (เดือนนี้)</div>
          <div className="text-2xl font-semibold mt-1">
            {cov.reduce((s, r) => s + r.shifts, 0)}
          </div>
          <div className="text-xs text-slate-400">รวมทุกประเภทเวร</div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm border">
          <div className="text-slate-500 text-sm">จำนวนแพทย์ขึ้นเวร Night</div>
          <div className="text-2xl font-semibold mt-1">
            {night.filter((n) => n.nights > 0).length}
          </div>
          <div className="text-xs text-slate-400">ที่มี Night อย่างน้อย 1 ครั้ง</div>
        </div>
      </div>

      {/* Coverage รายประเภทเวร */}
      <div className="rounded-xl bg-white p-4 shadow-sm border mb-4">
        <div className="font-medium mb-3">Coverage รายประเภทเวร</div>
        {loading ? (
          <div className="text-slate-500">กำลังโหลด…</div>
        ) : cov.length === 0 ? (
          <div className="text-slate-500">ไม่มีข้อมูล (ยังไม่ได้สร้างเวร/มอบหมาย)</div>
        ) : (
          <div className="space-y-3">
            {cov.map((r) => (
              <div key={r.shift_code}>
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="font-medium">{r.shift_name}</span>{" "}
                    <span className="text-slate-500">
                      ({r.assigned}/{r.required})
                    </span>
                  </div>
                  <div className="font-medium">{r.coverage}%</div>
                </div>
                <div className="h-2 bg-slate-200 rounded">
                  <div
                    className={`h-2 rounded ${
                      r.coverage >= 100
                        ? "bg-emerald-600"
                        : r.coverage >= 80
                        ? "bg-amber-500"
                        : "bg-rose-600"
                    }`}
                    style={{ width: `${Math.min(r.coverage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* แจกแจง Night ต่อคน */}
      <div className="rounded-xl bg-white p-4 shadow-sm border">
        <div className="font-medium mb-3">แจกแจงเวร Night ต่อแพทย์</div>
        {loading ? (
          <div className="text-slate-500">กำลังโหลด…</div>
        ) : night.length === 0 ? (
          <div className="text-slate-500">ไม่มีข้อมูล Night</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600">
                  <th className="text-left p-2 border">ชื่อย่อ</th>
                  <th className="text-left p-2 border">กลุ่ม</th>
                  <th className="text-right p-2 border">Night</th>
                  <th className="text-right p-2 border">Quota</th>
                  <th className="text-right p-2 border">เกินโควต้า</th>
                </tr>
              </thead>
              <tbody>
                {night.map((n) => (
                  <tr key={n.doctor_id} className="border-b">
                    <td className="p-2 border">{n.short_name}</td>
                    <td className="p-2 border capitalize">{n.group_name}</td>
                    <td className="p-2 border text-right">{n.nights}</td>
                    <td className="p-2 border text-right">{n.quota}</td>
                    <td
                      className={`p-2 border text-right ${
                        n.over_quota > 0 ? "text-rose-600 font-medium" : "text-slate-600"
                      }`}
                    >
                      {n.over_quota}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
