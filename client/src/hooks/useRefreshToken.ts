import axios from "../api/axios";
import { useStore } from "../store/root-store-context";

const useRefreshToken = () => {
  const { auth } = useStore();
  const { authData } = auth;

  const refresh = async () => {
    const response = await axios(`/refresh`, { withCredentials: true });
    auth.setAuthData({
      ...authData,
      user: response.data.user,
      accessToken: response.data.accessToken,
      roles: [response.data.role],
    });
    return response.data.accessToken;
  };

  return { refresh };
};

export default useRefreshToken;
