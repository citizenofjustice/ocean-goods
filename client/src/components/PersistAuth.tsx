import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
import useRefreshToken from "../hooks/useRefreshToken";
import LoadingSpinner from "./ui/LoadingSpinner";
import { useStore } from "../store/root-store-context";

const PersistAuth = observer(() => {
  const [isLoading, setIsLoading] = useState(true);
  const { refresh } = useRefreshToken();
  const { auth } = useStore();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth.authData.accessToken ? verifyRefreshToken() : setIsLoading(false);
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{isLoading ? <LoadingSpinner /> : <Outlet />}</>;
});

export default PersistAuth;
