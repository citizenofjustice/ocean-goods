import { makeAutoObservable } from "mobx";

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
}

export default new AuthStore();
