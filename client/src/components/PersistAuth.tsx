import { Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import useRefreshToken from "@/hooks/useRefreshToken";
import { useStore } from "@/store/root-store-context";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

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
        console.error(error);
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
