"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-client";

interface RequestRow {
  id: string;
  type: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
  doctor: { full_name: string; short_name: string | null } | null;
  payload: any;
}

export default function RequestsPage() {
  const [items, setItems] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const sb = supabaseBrowser();
      const { data, error } = await sb
        .from("requests")
        .select(`id, type, start_date, end_date, status, payload, doctor:doctor_id ( full_name, short_name )`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setItems((data ?? []) as any);
    } catch (e: any) {
      setError(e.message || "โหลดคำร้องไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || "อัปเดตไม่สำเร็จ");
      await load();
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4">จัดการคำร้องขอ</h1>
      {loading ? (
        <div className="text-slate-500">กำลังโหลด…</div>
      ) : error ? (
        <div className="text-rose-600">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-slate-500">ไม่มีคำร้องขอ</div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => {
            const who = it.doctor?.full_name || "ไม่ทราบ";
            let dateText = "";
            if (it.start_date && it.end_date) {
              dateText = `${it.start_date} – ${it.end_date}`;
            } else if (it.start_date) {
              dateText = it.start_date;
            }
            return (
              <div key={it.id} className="rounded-xl bg-white p-4 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-medium capitalize">{it.type}</div>
                  <div className="text-xs px-2 py-0.5 rounded-full bg-slate-100">{dateText || "–"}</div>
                </div>
                <div className="text-sm text-slate-600 mt-1">ผู้ขอ: {who}</div>
                {it.payload?.reason && <div className="text-sm text-slate-600">เหตุผล: {it.payload.reason}</div>}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => updateStatus(it.id, "approved")}
                    className="px-3 py-1 rounded bg-emerald-600 text-white text-sm"
                    disabled={it.status !== "pending"}
                  >อนุมัติ</button>
                  <button
                    onClick={() => updateStatus(it.id, "rejected")}
                    className="px-3 py-1 rounded bg-rose-600 text-white text-sm"
                    disabled={it.status !== "pending"}
                  >ปฏิเสธ</button>
                  {it.status !== "pending" && (
                    <span className="text-xs text-slate-500">
                      สถานะ: {it.status === "approved" ? "อนุมัติแล้ว" : "ปฏิเสธแล้ว"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
