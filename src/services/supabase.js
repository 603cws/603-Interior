import { createClient } from "@supabase/supabase-js";

const baseurl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const role = import.meta.env.VITE_SUPABASE_ROLE_KEY;
const AdminRole = import.meta.env.VITE_SUPABASE_ADMIN_KEY;
export const supabase = createClient(baseurl, role);

export const adminsupabase = createClient(baseurl, AdminRole);
// export const supabase = createClient(
//   "https://bwxzfwsoxwtzhjbzbdzs.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eHpmd3NveHd0emhqYnpiZHpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3ODg5MDAsImV4cCI6MjA0NjM2NDkwMH0.-KI-PwdX57jsu7ONfgQXDBFPv3AY5uFdQZlHcHdUzDg"
// );

// export const adminsupabase = createClient(
//   "https://bwxzfwsoxwtzhjbzbdzs.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eHpmd3NveHd0emhqYnpiZHpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDc4ODkwMCwiZXhwIjoyMDQ2MzY0OTAwfQ.tVx2ruCIBVjKuB8zGKG-BzPMo6DgPWZEANhASz_YpwA"
// );
