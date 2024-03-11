import { z } from "zod";

export const zodRolesForm = z.object({
  title: z
    .string()
    .min(1, { message: "Наименование роли не может быть пустым" }),
  privelegeIds: z
    .array(z.number())
    .refine((value) => value.some((item) => item), {
      message: "Нужно выбрать как минимум одну привилегию",
    }),
});
