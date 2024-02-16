import axios from "./axios";

export const getUserData = (id: number) => {
  return axios
    .get(`/users?=${id}`, { withCredentials: true })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

export const authUser = (authData: FormData) => {
  return axios
    .post(`/login`, authData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    });
};

export const getProductTypesSelectValues = () => {
  return axios(`/product-types/select-values`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
};
