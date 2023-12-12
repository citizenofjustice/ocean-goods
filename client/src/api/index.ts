import axios from "axios";
// import CatalogItemModel from "../classes/CatalogItemModel";

const baseUrl: string = "http://localhost:8080/api";

// export const createCatalogItem = (newItem: CatalogItemModel) => {
//   axios
//     .post(`${baseUrl}/catalog/create`, newItem)
//     .then(function (response) {
//       console.log(response);
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// };

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
  axios(`${baseUrl}/catalog`)
    .then(function (response) {
      console.log(response);
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
