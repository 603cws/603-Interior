import { supabase } from "../services/supabase";

export async function logError(error, errorInfo = null) {
  try {
    // Get logged-in user (safe even if not logged in)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("error_logs").insert({
      message: error?.message,
      stack: error?.stack,
      component_stack: errorInfo?.componentStack,
      url: window.location.href,
      user_agent: navigator.userAgent,
      user_email: user?.email ?? null,
      user_id: user?.id ?? null,
    });
  } catch (err) {
    console.error("Failed to log error", err);
  }
}
