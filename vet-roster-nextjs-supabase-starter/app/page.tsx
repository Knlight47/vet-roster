import Link from "next/link";
export default function Home(){
  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ตารางเวรของฉัน</h1>
        <div className="space-x-2">
          <Link className="underline" href="/requests">คำขอ</Link>
          <Link className="underline" href="/team">ตารางทีม</Link>
          <Link className="underline" href="/admin">Admin</Link>
        </div>
      </div>
      <div className="rounded-xl bg-white p-6 shadow">ปฏิทินของฉัน — กำลังนำข้อมูล</div>
    </main>
  );
}
