import { useEffect } from "react";

import { axiosPrivate } from "../api/axios";
import useRefreshToken from "./useRefreshToken";
import { useStore } from "../store/root-store-context";

// Hook for using axios with private routes
const useAxiosPrivate = () => {
  // Getting refresh function from useRefreshToken hook
  const { refresh } = useRefreshToken();
  // Getting auth store from root store
  const { auth } = useStore();
  const { authData } = auth;

  // Using useEffect to set up interceptors
  useEffect(() => {
    // Setting up request interceptor
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        // If Authorization header is not set, set it with the access token
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${authData.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Setting up response interceptor
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Getting previous request config
        const prevRequest = error?.config;
        // If response status is 403 and the request has not been sent before
        // refresh the token and resend the request
        if (error?.response.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    // Returning a cleanup function to eject the interceptors when the component unmounts
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [authData, refresh]);

  // Returning the axios instance
  return axiosPrivate;
};

export default useAxiosPrivate;
