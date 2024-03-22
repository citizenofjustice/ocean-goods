import { AxiosError } from "axios";

import axios from "@/api/axios";
import { useStore } from "@/store/root-store-context";

// Hook for refreshing access token
const useRefreshToken = () => {
  // Getting auth store from root store
  const { auth } = useStore();
  // Getting authData from auth store
  const { authData } = auth;

  // Function to refresh the access token
  const refresh = async () => {
    try {
      // Making a request to the refresh endpoint
      const response = await axios(`/refresh`, { withCredentials: true });
      // Updating the auth data with the new access token and user data
      auth.setAuthData({
        ...authData,
        user: response.data.user,
        accessToken: response.data.accessToken,
        priveleges: response.data.priveleges,
      });
      // Returning the new access token
      return response.data.accessToken;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.error.message);
      } else {
        console.error("Не удалось обновить токен авторизации:", error);
      }
      // Handle the error here
    }
  };

  // Returning the refresh function
  return { refresh };
};

export default useRefreshToken;
