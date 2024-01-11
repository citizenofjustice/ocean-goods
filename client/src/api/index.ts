import axios from "axios";
import { CatalogItem } from "../types/CatalogItem";

const baseUrl: string = "http://localhost:8080/api";

export const createCatalogItem = (newItem: FormData) => {
  return axios
    .post(`${baseUrl}/catalog/create`, newItem, {
      headers: { "Content-Type": "multipart/form-data" },
    })
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

export const removeCatalogItem = (id: number) => {
  return axios
    .delete(`${baseUrl}/catalog/${id}`)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

export const updateCatalogItem = (id: number, updatedItem: FormData) => {
  return axios
    .put(`${baseUrl}/catalog/${id}`, updatedItem, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(function (response) {
      console.log(response);
    })
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
