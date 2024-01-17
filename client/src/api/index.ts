import axios from "axios";
import { CatalogItem } from "../types/CatalogItem";
import { ProductType } from "../types/ProductType";

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

export const getCatalog = () => {
  return axios(`${baseUrl}/catalog`)
    .then(function (response) {
      if (response.status === 200) return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

export const getCatalogItem = (id: number) => {
  axios(`${baseUrl}/catalog?=${id}`)
    .then(function (response) {
      console.log(response);
      return response.data;
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

export const getUserData = (id: number) => {
  axios
    .get(`${baseUrl}/users?=${id}`)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

export const createProductType = (type: FormData) => {
  return axios
    .post(`${baseUrl}/product-types/create`, type, {
      headers: { "Content-Type": "application/json" },
    })
    .then(function (response) {
      console.log(response);
      if (response.status === 200) return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

export const getProductTypes = () => {
  return axios(`${baseUrl}/product-types`)
    .then(function (response) {
      console.log(response);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

export const removeProductType = (productTypeId: number) => {
  return axios
    .delete(`${baseUrl}/product-types/${productTypeId}`)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

export const updateProductType = (updatedProductType: ProductType) => {
  return axios
    .put(
      `${baseUrl}/product-types/${updatedProductType.productTypeId}`,
      updatedProductType,
      {
        headers: { "Content-Type": "application/json" },
      }
    )
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

export const getRoles = () => {
  return axios(`${baseUrl}/roles`)
    .then(function (response) {
      console.log(response);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return error.message;
    });
};

export const getPriveleges = () => {
  return axios(`${baseUrl}/priveleges`)
    .then(function (response) {
      console.log(response);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return error.message;
    });
};
