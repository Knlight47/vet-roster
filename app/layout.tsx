// app/layout.tsx (เพิ่ม UserMenu ตรงแถบบน)
import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";
import UserMenu from "@/components/UserMenu";

export const metadata = { title: "VetDuty" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="border-b bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-emerald-600 text-white rounded-lg p-2 font-bold">
                ❤
              </div>
              <div>
                <div className="font-semibold text-emerald-700">VetDuty</div>
                <div className="text-xs text-slate-500">
                  ระบบจัดการตารางเวรสัตวแพทย์
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-4 text-sm">
              <Link href="/" className="hover:text-emerald-700">
                Dashboard
              </Link>
              <Link href="/schedule" className="hover:text-emerald-700">
                ตารางเวร
              </Link>
              <Link href="/requests" className="hover:text-emerald-700">
                คำร้องขอ
              </Link>
              <Link href="/doctors" className="hover:text-emerald-700">
                จัดการแพทย์
              </Link>
              <Link href="/reports" className="hover:text-emerald-700">
                รายงาน
              </Link>
              <Link href="/settings" className="hover:text-emerald-700">
                ตั้งค่า
              </Link>
            </nav>

            <UserMenu />
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
