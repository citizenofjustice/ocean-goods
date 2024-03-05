import { z } from "zod";
import { zodInputStringPipe } from "./zodInputStringPipe";
import { zodImageFile } from "./zodImageFile";

export const zodCatalogItemForm = z.object({
  productName: z.string().min(2, { message: "Слишком короткое наименование" }),
  productTypeId: z.string().min(1, { message: "Укажите тип продукта" }),
  inStock: z.boolean(),
  description: z.string(),
  price: zodInputStringPipe(
    z.number().positive("Значение должно быть больше 0")
  ),
  discount: zodInputStringPipe(
    z
      .number()
      .min(0, { message: "Значение должно быть больше 0" })
      .max(100, { message: "Значение не должно быть больше 100" })
  ),
  weight: zodInputStringPipe(
    z.number().positive("Значение должно быть больше 0")
  ),
  kcal: zodInputStringPipe(
    z.number().positive("Значение должно быть больше 0")
  ),
  mainImage: z.union([zodImageFile, z.string()]),
});
