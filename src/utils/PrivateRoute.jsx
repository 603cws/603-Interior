import { useEffect, useState } from "react";
import PageNotFound from "../common-components/PageNotFound";
import SpinnerFullPage from "../common-components/SpinnerFullPage";
import { supabase } from "../services/supabase";

function PrivateRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    try {
      const sessionKey = supabase?.storageKey;
      const rawSession = sessionStorage.getItem(sessionKey);

      if (!rawSession) {
        setHasToken(false);
      } else {
        const sessionData = JSON.parse(rawSession);
        setHasToken(!!sessionData?.access_token);
      }
    } catch (err) {
      console.error("Session parse error:", err);
      setHasToken(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  if (isChecking) return <SpinnerFullPage />;
  if (!hasToken) return <PageNotFound />;

  return children;
}

export default PrivateRoute;
