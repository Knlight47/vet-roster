import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,          // URL เดิม
    process.env.SUPABASE_SERVICE_ROLE_KEY!,         // ใช้ Service Role Key
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
