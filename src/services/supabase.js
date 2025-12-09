import { createClient } from "@supabase/supabase-js";

const baseurl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const role = import.meta.env.VITE_SUPABASE_ROLE_KEY;
const AdminRole = import.meta.env.VITE_SUPABASE_ADMIN_KEY;
// export const supabase = createClient(baseurl, role);
export const supabase = createClient(baseurl, role, {
  auth: {
    storage: sessionStorage, // <-- use sessionStorage instead of localStorage
  },
});

export const adminsupabase = createClient(baseurl, AdminRole);
