import { useLocation, Navigate } from "react-router-dom";

function RedirectLogin() {
  const location = useLocation();
  return <Navigate to="/login" replace state={{ from: location }} />;
}

export default RedirectLogin;
