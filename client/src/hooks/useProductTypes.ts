import { z } from "zod";
import { AxiosError } from "axios";
import { UseFormReturn } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useStore } from "@/store/root-store-context";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { zodProductTypeForm } from "@/lib/zodProductTypeForm";

export function useProductTypes(
  form: UseFormReturn<z.infer<typeof zodProductTypeForm>>
) {
  // Initializing mobX store, queryClient for managing queries and axiosPrivate for requests with credentials
  const { alert } = useStore();
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  //   const [productType, setProductType] = useState<string>(""); // state for storing input value

  // Mutation for creating a new product type
  const mutation = useMutation({
    mutationFn: async (newType: FormData) => {
      const response = await axiosPrivate.post(
        `/product-types/create`,
        newType
      );
      return response.data;
    },
    onSuccess: async () => {
      // invalidate query data after addition of new product type
      await queryClient.invalidateQueries({ queryKey: ["product-type"] });
      form.reset(); // clear input value
    },
    onError: (error) => {
      // display error alert if request failed
      if (error instanceof AxiosError) {
        alert.setPopup({
          message: error.response?.data.error.message,
          type: "error",
        });
      } else
        alert.setPopup({
          message: "При добавлении нового типа произошла неизвестная ошибка",
          type: "error",
        });
    },
  });

  return {
    mutation,
  };
}
