"use client";
import { supabaseBrowser } from "@/lib/supabase-client";

export default function LoginPage(){
  const login = async () => {
    const sb = supabaseBrowser();
    await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/` }
    });
  };
  return (
    <main className="grid place-items-center h-[70vh]">
      <div className="card w-full max-w-sm text-center space-y-4">
        <h1 className="text-xl font-semibold">เข้าสู่ระบบ</h1>
        <button className="btn-primary w-full" onClick={login}>Login with Google</button>
      </div>
    </main>
  );
}
