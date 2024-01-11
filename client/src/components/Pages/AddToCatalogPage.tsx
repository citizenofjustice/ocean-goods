import { useState } from "react";

import ImageDropzone from "../UI/ImageDropzone";
import LabeledInputField from "../UI/LabeledInputField";
import { observer } from "mobx-react-lite";
import { createCatalogItem, updateCatalogItem } from "../../api";
import { CatalogItemInputs } from "../../types/form-types";
import SelectField from "../UI/SelectField";
import ToggleField from "../UI/ToggleField";
import TextareaField from "../UI/TextareaField";

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
  actionType: "CREATE" | "UPDATE";
  editItemId: number | undefined;
  initValues: CatalogItemInputs;
}> = observer(
  ({
    actionType = "CREATE",
    editItemId = undefined,
    initValues = emptyInitValues,
  }) => {
    const [inputValues, setInputValues] =
      useState<CatalogItemInputs>(initValues);

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (name === "mainImage") {
        const selectedFiles = e.target.files as FileList;
        setInputValues({ ...inputValues, [name]: selectedFiles[0] });
      } else {
        setInputValues({ ...inputValues, [name]: value });
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
          await createCatalogItem(fData);
          break;
        }
        case "UPDATE": {
          console.log(Object.fromEntries(fData));

          if (editItemId) await updateCatalogItem(editItemId, fData);
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
            <div className="grid gap-6 mb-6 md:grid-cols-2">
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
              />
              <LabeledInputField
                title="Цена"
                inputId="add-to-catalog-price"
                inputType="number"
                name="price"
                value={inputValues.price}
                onInputChange={handleValueChange}
              />

              <LabeledInputField
                title="Скидка"
                inputId="add-to-catalog-discount"
                inputType="number"
                name="discount"
                value={inputValues.discount}
                onInputChange={handleValueChange}
              />

              <LabeledInputField
                title="Вес"
                inputId="add-to-catalog-weight"
                inputType="number"
                name="weight"
                value={inputValues.weight}
                onInputChange={handleValueChange}
              />
              <LabeledInputField
                title="Ккал (на 100 гр.)"
                inputId="add-to-catalog-kcal"
                inputType="number"
                name="kcal"
                value={inputValues.kcal}
                onInputChange={handleValueChange}
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
            <div className="flex justify-center">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-3 text-center"
              >
                Cохранить
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }
);
export default AddToCatalogPage;
