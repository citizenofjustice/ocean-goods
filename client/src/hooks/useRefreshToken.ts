import axios from "../api/axios";
import { useStore } from "../store/root-store-context";

const useRefreshToken = () => {
  const { auth } = useStore();
  const { authData } = auth;

  const refresh = async () => {
    const response = await axios(`/users/refresh`, { withCredentials: true });
    auth.setAuthData({ ...authData, accessToken: response.data.accessToken });
    return response.data.accessToken;
  };

  return { refresh };
};

export default useRefreshToken;
