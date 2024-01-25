import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../store/root-store-context";

const RequireAuth: React.FC<{
  allowedRoles: number[];
}> = ({ allowedRoles }) => {
  const location = useLocation();
  const { auth } = useStore();
  const { authData } = auth;

  return (
    <>
      {authData?.roles?.find((role) => allowedRoles?.includes(role)) ? (
        <Outlet />
      ) : (
        <>
          {authData?.user ? (
            <Navigate to="/unauthorized" state={{ from: location }} replace />
          ) : (
            <Navigate to="/auth" state={{ from: location }} replace />
          )}
        </>
      )}
    </>
  );
};

export default RequireAuth;
