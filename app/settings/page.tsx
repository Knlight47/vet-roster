import { supabaseServer } from "@/lib/supabase-server";
import dynamic from "next/dynamic";

// โหลด client component แบบ dynamic
const ShiftTypesManager = dynamic(() => import("./parts/ShiftTypesManager"), { ssr: false });

export default async function SettingsPage() {
  const sb = supabaseServer();
  const { data: shiftTypes } = await sb
    .from("shift_types")
    .select("id, code, name, min_staff, max_staff, is_night")
    .order("code");

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6 space-y-4">
      <h1 className="text-xl md:text-2xl font-bold">ตั้งค่าระบบ</h1>
      <div className="rounded-xl bg-white p-6 shadow-sm border">
        <h2 className="text-lg font-semibold mb-3">จัดการประเภทเวร</h2>
        <ShiftTypesManager shiftTypesInitial={shiftTypes || []} />
      </div>
    </main>
  );
}
