"use client";
import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase-client";

export default function ShiftTypesManager({ shiftTypesInitial }) {
  const [items, setItems] = useState(shiftTypesInitial);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ code:"", name:"", min_staff:1, max_staff:1, is_night:false });

  async function refresh() {
    const sb = supabaseBrowser();
    const { data } = await sb.from("shift_types").select("id, code, name, min_staff, max_staff, is_night").order("code");
    setItems(data || []);
  }
  function openNew() { … }
  function openEdit(item) { … }
  async function save() {
    const body = { ...form };
    if (editId) body.id = editId;
    const res = await fetch("/api/settings/shift_types", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body) });
    …
    await refresh();
  }
  async function remove(id) { … }

  return (
    <div className="space-y-3">
      <button onClick={openNew} className="...">+ เพิ่มประเภทเวร</button>
      {/* ตาราง list ประเภทเวร พร้อมปุ่มแก้ไข/ลบ */}
      …
      {open && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center">
          <div className="bg-white max-w-lg p-4 rounded-xl">
            {/* ฟอร์มเพิ่ม/แก้ไข shift_type */}
            …
          </div>
        </div>
      )}
    </div>
  );
}
