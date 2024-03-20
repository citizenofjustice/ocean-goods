import { ScanEye } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import useRefreshToken from "@/hooks/useRefreshToken";
import { useStore } from "@/store/root-store-context";

const PersistAuth: React.FC<{
  children: React.ReactNode;
}> = observer(({ children }) => {
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

  return (
    <>
      {isLoading ? (
        <div className="relative mr-4">
          <ScanEye className="h-6 w-6 animate-pulse" />
        </div>
      ) : (
        children
      )}
    </>
  );
});

export default PersistAuth;
