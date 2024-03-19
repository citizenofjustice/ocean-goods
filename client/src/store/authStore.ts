import { action, makeAutoObservable } from "mobx";

import axios from "@/api/axios";

// Interface for the authentication data
interface AuthData {
  user: string | undefined;
  accessToken: string | undefined;
  priveleges: number[] | undefined;
}

// Class for the authentication store
class AuthStore {
  // Authentication data
  authData: AuthData = {
    user: undefined,
    accessToken: undefined,
    priveleges: undefined,
  };

  // Getter to check if the user is authenticated
  get isAuth() {
    const isAuth: boolean =
      this.authData.user !== undefined &&
      this.authData.accessToken !== undefined;
    return isAuth;
  }

  // Constructor for the AuthStore class
  constructor() {
    // Making all properties of this class observable and actions for MobX
    makeAutoObservable(this, {
      setAuthData: action,
      logoutUser: action,
    });
  }

  // Action to set the authentication data
  setAuthData = (authData: AuthData) => {
    this.authData = authData;
  };

  // Action to log out the user
  logoutUser = async () => {
    try {
      // Making a request to the logout endpoint
      const response = await axios.get(`/logout`, { withCredentials: true });
      const isLoggedOut = response.status === 204;
      // If the user is logged out, clear the authentication data
      if (isLoggedOut) {
        this.authData.user = undefined;
        this.authData.accessToken = undefined;
        this.authData.priveleges = undefined;
      }
      return isLoggedOut;
    } catch (error) {
      // Log the error and return false
      console.error("Failed to logout:", error);
      return false;
    }
  };
}

export default new AuthStore();
