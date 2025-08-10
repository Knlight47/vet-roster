// components/UserMenu.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

const supabase = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

export default function UserMenu() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const s = supabase();
    s.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const login = async () => {
    const s = supabase();
    await s.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/` },
    });
  };

  const logout = async () => {
    const s = supabase();
    await s.auth.signOut();
    location.reload();
  };

  if (!user)
    return (
      <button
        onClick={login}
        className="text-sm px-3 py-1 rounded border hover:bg-slate-50"
      >
        เข้าสู่ระบบ
      </button>
    );

  const pic =
    user.user_metadata?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.user_metadata?.full_name || user.email
    )}`;

  return (
    <div className="flex items-center gap-3">
      <Image
        src={pic}
        alt="profile"
        width={28}
        height={28}
        className="rounded-full"
      />
      <span className="hidden sm:block text-sm">
        {user.user_metadata?.full_name || user.email}
      </span>
      <button
        onClick={logout}
        className="text-sm px-3 py-1 rounded border hover:bg-slate-50"
      >
        ออกจากระบบ
      </button>
    </div>
  );
}
