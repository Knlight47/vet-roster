import { supabaseServer } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const sb = supabaseServer();
  // นับแพทย์แยก junior/senior
  const { data: userRows } = await sb.from("users").select("doctor_group");
  const totalDoctors = userRows?.length ?? 0;
  const juniors = userRows?.filter((u: any) => u.doctor_group === "junior").length ?? 0;
  const seniors = totalDoctors - juniors;

  // เวรวันนี้ (status = published)
  const iso = new Date().toISOString().substring(0, 10);
  const { data: todayShifts } = await sb.from("shifts").select("id").eq("date", iso).eq("status","published");
  const workingShifts = todayShifts?.length ?? 0;

  // คำขอ pending
  const { count: pending } = await sb.from("requests").select("id", { count: "exact", head: true }).eq("status", "pending");

  // Coverage rate
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const start = `${year}-${String(month).padStart(2,"0")}-01`;
  const end   = `${year}-${String(month).padStart(2,"0")}-31`;
  let coverageRate = 0;
  try {
    const { data: cov } = await sb.rpc("report_shift_coverage", { p_start: start, p_end: end });
    if (cov && cov.length > 0) {
      const req = cov.reduce((s: number,r: any) => s + r.required,0);
      const ass = cov.reduce((s: number,r: any) => s + r.assigned,0);
      coverageRate = req === 0 ? 0 : Math.round((ass*100)/req);
    }
  } catch { coverageRate = 0; }

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6 space-y-4">
      {/* การ์ด 4 ใบ */}
      …
    </main>
  );
}
