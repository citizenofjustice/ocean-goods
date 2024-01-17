export type CatalogItemInputs = {
  productName: string;
  productTypeId: string;
  inStock: boolean;
  description: string;
  price: string;
  discount: string;
  weight: string;
  kcal: string;
  mainImage?: File | string;
};

export type RoleInputs = {
  title: string;
  privelegeIds: number[];
};
