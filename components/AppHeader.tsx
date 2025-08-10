"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-client";

export default function AppHeader() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const sb = supabaseBrowser();
    sb.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = sb.auth.onAuthStateChange(() => {
      sb.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    const sb = supabaseBrowser();
    await sb.auth.signOut();
    location.href = "/login";
  };

  return (
    <div className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-emerald-600 text-white rounded-lg p-2 font-bold">❤</div>
          <div>
            <div className="font-semibold text-emerald-700">VetDuty</div>
            <div className="text-xs text-slate-500">ระบบจัดการตารางเวรสัตวแพทย์</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link href="/" className="hover:text-emerald-700">Dashboard</Link>
          <Link href="/schedule" className="hover:text-emerald-700">ตารางเวร</Link>
          <Link href="/requests" className="hover:text-emerald-700">คำร้องขอ</Link>
          <Link href="/doctors" className="hover:text-emerald-700">จัดการแพทย์</Link>
          <Link href="/reports" className="hover:text-emerald-700">รายงาน</Link>
          <Link href="/settings" className="hover:text-emerald-700">ตั้งค่า</Link>

          {!email ? (
            <Link href="/login" className="px-3 py-1.5 rounded-lg border hover:bg-slate-50">
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-slate-500">{email}</span>
              <button onClick={logout} className="px-3 py-1.5 rounded-lg border hover:bg-slate-50">
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
