import { useState } from "react";
import LabeledInputField from "./ui/LabeledInputField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { AxiosError } from "axios";
import { useStore } from "../store/root-store-context";

const ProductTypeAdd: React.FC<{
  onAdditionCancel: () => void;
}> = ({ onAdditionCancel }) => {
  // Initializing mobX store, queryClient for managing queries and axiosPrivate for requests with credentials
  const { alert } = useStore();
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  const [productType, setProductType] = useState<string>(""); // state for storing input value

  // Handler for form submission event
  const handleProductTypeSubmission = (
    event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) => {
    event.preventDefault();
    const fData = new FormData(event.currentTarget);
    mutation.mutate(fData);
  };

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
      setProductType(""); // clear input value
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

  return (
    <>
      <form
        onSubmit={handleProductTypeSubmission}
        className="w-full text-center mt-4"
      >
        <div className="flex bg-background-50 py-4 px-2 rounded-lg gap-1">
          <LabeledInputField
            inputId="product-type-add"
            inputType="text"
            name="type"
            title="Тип продукта"
            value={productType}
            onInputChange={(e) => setProductType(e.target.value)}
          />
          <div className="flex flex-col items-center justify-end basis-2/12 gap-1">
            <XCircleIcon
              onClick={onAdditionCancel}
              className="w-6 h-6 text-primary-800 hover:cursor-pointer"
            />
            <button type="submit">
              <CheckCircleIcon className="w-6 h-6 text-primary-800 hover:cursor-pointer" />
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ProductTypeAdd;
