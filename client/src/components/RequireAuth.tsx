import { observer } from "mobx-react-lite";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useStore } from "@/store/root-store-context";
import LoadingSpinner from "./UI/LoadingSpinner";

const RequireAuth: React.FC<{
  allowedPriveleges: number[];
}> = observer(({ allowedPriveleges }) => {
  const location = useLocation();
  const { auth } = useStore();
  const { isAuth, authData, authPending } = auth;

  if (authPending) return <LoadingSpinner />;

  return (
    <>
      {authData?.priveleges?.find((privelege) =>
        allowedPriveleges?.includes(privelege),
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
