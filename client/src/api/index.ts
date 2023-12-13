import axios from "axios";
import { NewCatalogItem } from "../types/form-types";
import { CatalogItem } from "../types/CatalogItem";

const baseUrl: string = "http://localhost:8080/api";

export const createCatalogItem = (newItem: NewCatalogItem) => {
  return axios
    .post(`${baseUrl}/catalog/create`, newItem)
    .then(function (response) {
      console.log(response);
      if (response.status === 200) return response.data;
    })
    .then((res: CatalogItem) => res)
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

export const getUserData = (id: number) => {
  axios
    .get(`${baseUrl}/users?=${id}`)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const getCatalog = () => {
  return axios(`${baseUrl}/catalog`)
    .then(function (response) {
      if (response.status === 200) return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const getCatalogItem = (id: number) => {
  axios(`${baseUrl}/catalog?=${id}`)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};
