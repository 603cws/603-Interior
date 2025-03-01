import React from "react";
import { useApp } from "../Context/Context";
import { supabase } from "../services/supabase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();
  const {
    setIsAuthLoading,
    setAccountHolder,
    setTotalArea,
    setIsAuthenticated,
  } = useApp();

  const handleLogout = async () => {
    console.log("hello");

    try {
      setIsAuthLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log("Error signing out:", error.message);
      } else {
        toast.success("User signed out successfully");
        setAccountHolder({
          companyName: "",
          email: "",
          phone: "",
          role: "",
          userId: "",
        });
        setTotalArea("");
        localStorage.removeItem("currentLayoutID");
        navigate("/");
        setIsAuthenticated(false);
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  return handleLogout;
};
