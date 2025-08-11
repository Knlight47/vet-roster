import AddDoctor from "./parts/AddDoctor";
import DoctorRow from "./parts/DoctorRow";
import { supabaseServer } from "@/lib/supabase-server";

export default async function DoctorsPage() {
  const sb = supabaseServer();
  const { data: doctors } = await sb
    .from("users")
    .select("id, full_name, short_name, email, role, doctor_group, weekly_night_quota, day_off_1, day_off_2, day_off_3, not_interested_in_sur, active")
    .order("full_name");

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">จัดการข้อมูลแพทย์</h1>
        <AddDoctor />
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm border overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr><th>ชื่อ</th><th>อีเมล</th><th>กลุ่ม</th><th>บทบาท</th><th>โควต้า Night</th><th>วันหยุด</th><th>สนใจ SUR?</th><th></th></tr>
          </thead>
          <tbody>
            {doctors && doctors.length>0 ? doctors.map((d) => (
              <DoctorRow key={d.id} doctor={d} />
            )) : (
              <tr><td colSpan={8} className="p-3 text-slate-500">ยังไม่มีข้อมูลแพทย์</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
