import { observer } from "mobx-react-lite";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useStore } from "@/store/root-store-context";

const RequireAuth: React.FC<{
  allowedPriveleges: number[];
}> = observer(({ allowedPriveleges }) => {
  const location = useLocation();
  const { auth } = useStore();
  const { isAuth, authData } = auth;

  return (
    <>
      {authData?.priveleges?.find((privelege) =>
        allowedPriveleges?.includes(privelege)
      ) ? (
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
