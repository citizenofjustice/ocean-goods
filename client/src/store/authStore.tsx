import { makeAutoObservable } from "mobx";
import axios from "../api/axios";

interface AuthData {
  accessToken: string | undefined;
}

class AuthStore {
  authData: AuthData = {
    accessToken: undefined,
  };

  constructor() {
    makeAutoObservable(this);
  }

  setAuthData = (authData: AuthData) => {
    this.authData = authData;
  };

  logoutUser = async () => {
    const response = await axios.get(`/logout`, { withCredentials: true });
    const isLoggedOut = response.status === 204;
    if (isLoggedOut) {
      this.authData.accessToken = undefined;
    }
    return isLoggedOut;
  };
}

export default new AuthStore();
