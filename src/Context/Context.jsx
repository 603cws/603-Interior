import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const session = supabase.storageKey;

  const [loading, setLoading] = useState(true);
  const [accountHolder, setAccountHolder] = useState({
    userId: "",
    email: "",
    phone: "",
    companyName: "",
    role: "",
    allowedCategory: [] || undefined,
    profileImage: null,
    location: "",
    boqName: "",
    address: [] || undefined,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    async function fetchdata() {
      const sessionData = JSON.parse(sessionStorage.getItem(session));

      const usertoken = sessionData?.access_token;

      if (!usertoken) {
        setIsAuthenticated(false);
        setIsAuthLoading(false);
      }
      if (usertoken) {
        const { data, error } = await supabase.auth.getUser(usertoken);
        if (error) {
          console.warn("Error fetching user:", error);
          setIsAuthenticated(false);
          setIsAuthLoading(false);
          return null;
        }

        if (data) {
          // setUserId(data.user.id);
          setIsAuthenticated(true);
          setIsAuthLoading(false);
        }
      }
    }

    fetchdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserData = async () => {
    try {
      if (isAuthenticated) {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) return;

        const userId = user.id;
        const userEmail = user.email;

        const { data, error: profileError } = await supabase
          .from("profiles")
          .select(
            "phone, company_name,role,allowed_category,profile_image,location,address"
          )
          .eq("id", userId)
          .single();

        if (profileError) throw profileError;

        setAccountHolder({
          userId,
          email: userEmail,
          phone: data.phone || "",
          companyName: data.company_name || "",
          role: data.role || "",
          allowedCategory: JSON.parse(data.allowed_category) || undefined,
          profileImage: data.profile_image || null,
          location: data.location || "",
          address: JSON.parse(data.address) || [],
        });
      }
    } catch (error) {
      console.warn("Error fetching user data:", error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isAuthenticated]);

  return (
    <AppContext.Provider
      value={{
        loading,
        setLoading,
        accountHolder,
        setAccountHolder,
        isAuthenticated,
        setIsAuthenticated,
        isAuthLoading,
        setIsAuthLoading,
        selectedClient,
        setSelectedClient,
        fetchUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
};
