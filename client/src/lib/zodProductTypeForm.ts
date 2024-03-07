import { z } from "zod";

export const zodProductTypeForm = z.object({
  type: z.string().min(1, { message: "Обязательное поле для заполнения" }),
});
