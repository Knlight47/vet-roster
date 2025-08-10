"use client";
import { supabaseBrowser } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
export default function LoginPage(){
  const login = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signInWithOAuth({ provider: "google", options:{ redirectTo: `${location.origin}/` }});
  };
  return (
    <main className="grid place-items-center h-[80vh]">
      <div className="p-8 rounded-2xl shadow bg-white w-full max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold">เข้าสู่ระบบ</h1>
        <Button className="w-full" onClick={login}>Login with Google</Button>
      </div>
    </main>
  );
}
