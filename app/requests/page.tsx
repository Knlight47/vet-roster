"use client";
import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase-client";

export default function RequestsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [newOpen, setNewOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    doctor_id: "",
    type: "day_off",
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [doctors, setDoctors] = useState<any[]>([]);

  async function load() {
    const sb = supabaseBrowser();
    const { data } = await sb
      .from("requests")
      .select("id, doctor_id, type, start_date, end_date, status, payload")
      .order("created_at", { ascending: false });
    setItems(data || []);
  }

  // โหลดรายการคำร้องและรายชื่อแพทย์
  useEffect(() => {
    load();
    (async () => {
      const sb = supabaseBrowser();
      const { data } = await sb.from("users").select("id, full_name").order("full_name");
      setDoctors(data || []);
    })();
  }, []);

  // สร้างคำร้องใหม่
  async function saveNewRequest() {
    const payload:any = {};
    if (newForm.reason) payload.reason = newForm.reason;
    const sb = supabaseBrowser();
    await sb.from("requests").insert({
      type: newForm.type,
      start_date: newForm.start_date || null,
      end_date: newForm.end_date || null,
      doctor_id: newForm.doctor_id,
      payload,
    });
    setNewOpen(false);
    setNewForm({
      doctor_id: "",
      type: "day_off",
      start_date: "",
      end_date: "",
      reason: "",
    });
    await load();
  }

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl md:text-2xl font-bold">จัดการคำร้องขอ</h1>
        <button onClick={() => setNewOpen(true)} className="px-3 py-1.5 rounded bg-emerald-600 text-white">+ สร้างคำร้อง</button>
      </div>
      {/* แสดงรายการคำร้อง พร้อมปุ่มอนุมัติ/ปฏิเสธ */}
      …
      {newOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center">
          <div className="bg-white max-w-lg w-full p-4 rounded-xl space-y-3">
            <div className="text-lg font-semibold">สร้างคำร้องใหม่</div>
            {/* ฟอร์มเลือกแพทย์, ประเภทคำร้อง, วันที่เริ่ม-สิ้นสุด, เหตุผล */}
            …
            <div className="flex justify-end gap-2">
              <button onClick={() => setNewOpen(false)} className="px-3 py-1.5 rounded border">ยกเลิก</button>
              <button onClick={saveNewRequest} className="px-3 py-1.5 rounded bg-emerald-600 text-white">บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
