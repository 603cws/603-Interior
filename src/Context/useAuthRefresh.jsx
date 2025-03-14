import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useApp } from "./Context";
import toast from "react-hot-toast";

const useAuthRefresh = () => {
  const { setIsAuthenticated } = useApp();

  const [isUserActive, setIsUserActive] = useState(true);
  const navigate = useNavigate();
  let inactivityTimeout, refreshInterval;
  const session = supabase.storageKey;

  useEffect(() => {
    const handleUserActivity = () => {
      setIsUserActive(true);
      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(() => {
        setIsUserActive(false);
      }, 60 * 60 * 1000); // 1 hour inactivity
    };

    // Listen to user activity
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      clearTimeout(inactivityTimeout);
    };
  }, []);

  useEffect(() => {
    // Check and refresh token every 5 minutes
    refreshInterval = setInterval(() => {
      checkAndRefreshToken();
    }, 5 * 60 * 1000); // 5 min interval

    return () => clearInterval(refreshInterval);
  }, [isUserActive]);

  const checkAndRefreshToken = async () => {
    const sessionData = JSON.parse(localStorage.getItem("session"));
    console.log(sessionData);
    if (!sessionData || !sessionData.expires_at || !sessionData.refresh_token) {
      console.log("Session data missing. Signing out...");
      // signOutUser();
      return;
    }

    const { expires_at, refresh_token } = sessionData;
    const currentTime = Math.floor(Date.now() / 1000);
    const timeRemaining = expires_at - currentTime;

    console.log(`Current Time: ${new Date().toLocaleString()}`);
    console.log(`Token expires in: ${timeRemaining} seconds`);

    if (timeRemaining < 300) {
      // Less than 5 minutes remaining
      if (isUserActive) {
        console.log("Refreshing token...");
        const { data, error } = await supabase.auth.refreshSession({
          refresh_token,
        });

        if (error) {
          console.error("Token refresh failed:", error.message);
          signOutUser();
        } else {
          console.log("Token refreshed successfully.");
          localStorage.setItem(session, JSON.stringify(data.session)); // Update session
        }
      }
    }
  };

  const signOutUser = async () => {
    const currentTime = new Date().toLocaleString(); // Get current time in readable format
    console.log(`User Signing out... Time: ${currentTime}`);

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      toast.success("User signed out successfully");
      setIsAuthenticated(false);
      console.log("User signed out successfully");
      navigate("/login"); // Redirect to login page
    }
  };

  return { isUserActive, signOutUser };
};

export default useAuthRefresh;
