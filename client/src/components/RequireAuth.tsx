import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../store/root-store-context";

const RequireAuth = () => {
  const location = useLocation();
  const { auth } = useStore();
  const { authData } = auth;

  return (
    <>
      {authData?.accessToken ? (
        <Outlet />
      ) : (
        <Navigate to="/auth" state={{ from: location }} replace />
      )}
    </>
  );
};

export default RequireAuth;
