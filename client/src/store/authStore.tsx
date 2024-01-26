import { makeAutoObservable } from "mobx";
import axios from "../api/axios";

interface AuthData {
  user: string | undefined;
  accessToken: string | undefined;
  roles: number[] | undefined;
}

class AuthStore {
  authData: AuthData = {
    user: undefined,
    accessToken: undefined,
    roles: undefined,
  };

  get isAuth() {
    const isAuth: boolean = this.authData.user !== undefined;
    return isAuth;
  }

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
      this.authData.user = undefined;
      this.authData.accessToken = undefined;
      this.authData.roles = undefined;
    }
    return isLoggedOut;
  };
}

export default new AuthStore();
