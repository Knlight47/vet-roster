import "./globals.css";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-client";

export const metadata = { title: "VetDuty" };

type UserBar = {
  email: string | null;
  name: string | null;
  avatar: string | null;
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const [userBar, setUserBar] = useState<UserBar>({ email: null, name: null, avatar: null });

  useEffect(() => {
    const sb = supabaseBrowser();
    const pull = async () => {
      const { data } = await sb.auth.getUser();
      const u = data.user;
      const meta: any = u?.user_metadata ?? {};
      setUserBar({
        email: u?.email ?? null,
        name: (meta.full_name || meta.name || null),
        avatar: (meta.avatar_url || meta.picture || null), // Google มักให้ picture
      });
    };
    pull();
    const { data: sub } = sb.auth.onAuthStateChange(() => pull());
    return () => sub.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    const sb = supabaseBrowser();
    await sb.auth.signOut();
    location.href = "/login";
  };

  const Initials = ({ text }: { text: string }) => {
    const ii = text
      .split("@")[0]
      .split(/[\s._-]+/)
      .filter(Boolean)
      .map((p) => p[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-700">
        {ii || "?"}
      </div>
    );
  };

  return (
    <html lang="th">
      <body className="min-h-screen bg-slate-50 text-slate-900">
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
              <Link href="/">Dashboard</Link>
              <Link href="/schedule">ตารางเวร</Link>
              <Link href="/requests">คำร้องขอ</Link>
              <Link href="/doctors">จัดการแพทย์</Link>
              <Link href="/reports">รายงาน</Link>
              <Link href="/settings">ตั้งค่า</Link>

              {!userBar.email ? (
                <Link href="/login" className="hover:text-emerald-700">Login</Link>
              ) : (
                <div className="flex items-center gap-2 pl-3 ml-3 border-l">
                  {userBar.avatar ? (
                    <img
                      src={userBar.avatar}
                      alt="avatar"
                      className="h-7 w-7 rounded-full border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Initials text={userBar.name || userBar.email || "?"} />
                  )}
                  <div className="flex flex-col leading-tight">
                    <span className="text-[13px] font-medium text-slate-700 line-clamp-1 max-w-[180px]">
                      {userBar.name || userBar.email}
                    </span>
                    <span className="text-[11px] text-slate-400 line-clamp-1 max-w-[180px]">
                      {userBar.name ? userBar.email : ""}
                    </span>
                  </div>
                  <button onClick={logout} className="px-2 py-1 rounded-lg border hover:bg-slate-50">Logout</button>
                </div>
              )}
            </nav>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
