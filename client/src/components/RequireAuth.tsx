import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../store/root-store-context";
import { observer } from "mobx-react-lite";

const RequireAuth: React.FC<{
  allowedRoles: number[];
}> = observer(({ allowedRoles }) => {
  const location = useLocation();
  const { auth } = useStore();
  const { isAuth, authData } = auth;

  return (
    <>
      {authData?.roles?.find((role) => allowedRoles?.includes(role)) ? (
        <Outlet />
      ) : (
        <>
          {isAuth ? (
            <Navigate to="/unauthorized" state={{ from: location }} replace />
          ) : (
            <Navigate to="/auth" state={{ from: location }} replace />
          )}
        </>
      )}
    </>
  );
});

export default RequireAuth;
