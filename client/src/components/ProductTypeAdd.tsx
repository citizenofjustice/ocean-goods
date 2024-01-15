import { useState } from "react";
import LabeledInputField from "./UI/LabeledInputField";
import DefaultButton from "./UI/DefaultButton";
import { createProductType } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ProductTypeAdd = () => {
  const [productType, setProductType] = useState<string>("");
  const queryClient = useQueryClient();

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
    mutationFn: async (fData: FormData) => await createProductType(fData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["product-type"] });
      setProductType("");
    },
  });

  return (
    <>
      <form
        onSubmit={handleProductTypeSubmission}
        className="w-fit text-center"
      >
        <LabeledInputField
          inputId="product-type-add"
          inputType="text"
          name="type"
          title="Тип продукта"
          value={productType}
          onInputChange={handleProductTypeInput}
        />
        <DefaultButton type="submit">Сохранить</DefaultButton>
      </form>
    </>
  );
};

export default ProductTypeAdd;
