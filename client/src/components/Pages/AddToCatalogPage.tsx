import { useState } from "react";

import ImageDropzone from "../UI/ImageDropzone";
import LabeledInputField from "../UI/LabeledInputField";
import { observer } from "mobx-react-lite";
import { getProductTypesSelectValues } from "../../api";
import { CatalogItemInputs } from "../../types/form-types";
import SelectField from "../UI/SelectField";
import ToggleField from "../UI/ToggleField";
import TextareaField from "../UI/TextareaField";
import DefaultButton from "../UI/DefaultButton";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const emptyInitValues: CatalogItemInputs = {
  productName: "",
  productTypeId: "",
  inStock: false,
  description: "",
  price: "",
  discount: "",
  weight: "",
  kcal: "",
  mainImage: undefined,
};

const AddToCatalogPage: React.FC<{
  actionType?: "CREATE" | "UPDATE";
  editItemId?: number;
  initValues?: CatalogItemInputs;
}> = observer(
  ({
    actionType = "CREATE",
    editItemId = undefined,
    initValues = emptyInitValues,
  }) => {
    const [inputValues, setInputValues] =
      useState<CatalogItemInputs>(initValues);
    const axiosPrivate = useAxiosPrivate();

    const { isLoading, isError, data } = useQuery({
      queryKey: ["product-type-select"],
      queryFn: async () => await getProductTypesSelectValues(),
      refetchOnWindowFocus: false,
    });

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, type, value } = e.target;
      if (name === "mainImage") {
        const selectedFiles = e.target.files as FileList;
        setInputValues({ ...inputValues, [name]: selectedFiles[0] });
      } else {
        setInputValues({
          ...inputValues,
          [name]: type === "number" ? Number(value) : value,
        });
      }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setInputValues({ ...inputValues, [name]: value });
    };

    const handleImageReset = () => {
      setInputValues({ ...inputValues, mainImage: undefined });
    };

    const handleToggleChange = () => {
      setInputValues({ ...inputValues, inStock: !inputValues.inStock });
    };

    const handleTextareaChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setInputValues({ ...inputValues, [name]: value });
    };

    const handleFormSubmittion = async (
      event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>
    ) => {
      event.preventDefault();
      const fData = new FormData(event.currentTarget);
      switch (actionType) {
        case "CREATE": {
          const response = await axiosPrivate.post(`/catalog/create`, fData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          console.log(response.data);
          break;
        }
        case "UPDATE": {
          const isInputImageValueEmpty =
            inputValues.mainImage === undefined || inputValues.mainImage === "";

          if (isInputImageValueEmpty || inputValues.mainImage instanceof File) {
            // in case of input field containing File
          } else {
            // if new image file was not added, replace field in formdata
            fData.set("mainImage", `${inputValues.mainImage}`);
          }

          if (!editItemId)
            throw new Error(
              "Не обнаружен идентификатор редактируемого продукта"
            );
          const response = await axiosPrivate.put(
            `/catalog/${editItemId}`,
            fData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          console.log(response);

          break;
        }
        default: {
          //statements;
          break;
        }
      }
      setInputValues(emptyInitValues);
    };

    return (
      <>
        <div className="p-4">
          <form onSubmit={handleFormSubmittion}>
            <div className="grid gap-6 md:grid-cols-2">
              <LabeledInputField
                title="Название"
                inputId="add-to-catalog-name"
                inputType="text"
                name="productName"
                value={inputValues.productName}
                onInputChange={handleValueChange}
              />
              <SelectField
                title="Тип продукта"
                inputId="add-to-catalog-product-type"
                name="productTypeId"
                onSelectChange={handleSelectChange}
                value={inputValues.productTypeId}
                isLoading={isLoading}
                isError={isError}
                options={data}
              />
              <LabeledInputField
                title="Цена"
                inputId="add-to-catalog-price"
                inputType="number"
                name="price"
                value={inputValues.price}
                onInputChange={handleValueChange}
                attr={{
                  min: 0,
                }}
              />
              <LabeledInputField
                title="Скидка"
                inputId="add-to-catalog-discount"
                inputType="number"
                name="discount"
                value={inputValues.discount}
                onInputChange={handleValueChange}
                attr={{
                  maxLength: 2,
                  min: 0,
                  max: 99,
                }}
              />
              <LabeledInputField
                title="Вес"
                inputId="add-to-catalog-weight"
                inputType="number"
                name="weight"
                value={inputValues.weight}
                onInputChange={handleValueChange}
                attr={{
                  min: 0,
                }}
              />
              <LabeledInputField
                title="Ккал (на 100 гр.)"
                inputId="add-to-catalog-kcal"
                inputType="number"
                name="kcal"
                value={inputValues.kcal}
                onInputChange={handleValueChange}
                attr={{
                  min: 0,
                }}
              />
              <ImageDropzone
                id="add-to-catalog-image"
                type="file"
                name="mainImage"
                previewImage={inputValues.mainImage}
                onInputChange={handleValueChange}
                onRemove={handleImageReset}
              />
              <TextareaField
                inputId="add-to-catalog-description"
                title="Описание"
                name="description"
                value={inputValues.description}
                onInputChange={handleTextareaChange}
              />
              <ToggleField
                title="Наличие продука"
                inputId="add-to-catalog-in-stock"
                inputType="checkbox"
                name="inStock"
                onToggleChange={handleToggleChange}
                checked={initValues.inStock}
              />
            </div>
            <DefaultButton type="submit">Cохранить</DefaultButton>
          </form>
        </div>
      </>
    );
  }
);
export default AddToCatalogPage;
