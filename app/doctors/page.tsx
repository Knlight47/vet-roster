// app/doctors/page.tsx
import AddDoctor from "./parts/AddDoctor";
import { supabaseServer } from "@/lib/supabase-server";

export default async function DoctorsPage() {
  const sb = supabaseServer();
  const { data: doctors } = await sb
    .from("users")
    .select("id, full_name, short_name, email, role, doctor_group, weekly_night_quota, day_off_1, day_off_2, day_off_3, not_interested_in_sur")
    .order("full_name", { ascending: true });

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">จัดการข้อมูลแพทย์</h1>
        <AddDoctor />
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm border overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="p-2">ชื่อ</th>
              <th className="p-2">อีเมล</th>
              <th className="p-2">กลุ่ม</th>
              <th className="p-2">บทบาท</th>
              <th className="p-2">โควต้า Night</th>
              <th className="p-2">วันหยุด</th>
              <th className="p-2">สนใจ SUR?</th>
            </tr>
          </thead>
          <tbody>
            {doctors?.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-2">
                  {d.full_name} ({d.short_name})
                </td>
                <td className="p-2">{d.email}</td>
                <td className="p-2">{d.doctor_group}</td>
                <td className="p-2">{d.role}</td>
                <td className="p-2">{d.weekly_night_quota ?? "-"}</td>
                <td className="p-2">
                  {[d.day_off_1, d.day_off_2, d.day_off_3].filter(Boolean).join(", ")}
                </td>
                <td className="p-2">
                  {d.not_interested_in_sur ? "ไม่สนใจ" : "สนใจ"}
                </td>
              </tr>
            ))}
            {!doctors?.length && (
              <tr>
                <td className="p-3 text-slate-500" colSpan={7}>
                  ยังไม่มีข้อมูลแพทย์
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
