import { useState } from "react";
import LabeledInputField from "./UI/LabeledInputField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const ProductTypeAdd: React.FC<{
  onAdditionCancel: () => void;
}> = ({ onAdditionCancel }) => {
  const [productType, setProductType] = useState<string>("");
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  const handleProductTypeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductType(e.target.value);
  };

  const handleProductTypeSubmission = (
    event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) => {
    event.preventDefault();
    const fData = new FormData(event.currentTarget);
    mutation.mutate(fData);
  };

  const mutation = useMutation({
    mutationFn: async (newType: FormData) => {
      const response = await axiosPrivate.post(
        `/product-types/create`,
        newType
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["product-type"] });
      setProductType("");
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
            onInputChange={handleProductTypeInput}
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
