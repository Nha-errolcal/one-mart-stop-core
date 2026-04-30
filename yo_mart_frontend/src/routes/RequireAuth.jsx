import { Navigate } from "react-router-dom";
import { getProfile } from "@/store/profile";

const RequireAuth = ({ children }) => {
  const user = getProfile();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;
