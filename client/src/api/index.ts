import axios from "./axios";

export const getCatalog = () => {
  return axios("/catalog")
    .then(function (response) {
      if (response.status === 200) return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

export const getCatalogItem = (id: number) => {
  axios(`/catalog?=${id}`)
    .then(function (response) {
      console.log(response);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

export const registerUser = (userData: FormData) => {
  return axios
    .post(`/users/register`, userData, {
      headers: { "Content-Type": "application/json" },
    })
    .then(function (response) {
      console.log(response);
      return response;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

export const getUserData = (id: number) => {
  return axios
    .get(`/users?=${id}`)
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
      console.log(response);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};
