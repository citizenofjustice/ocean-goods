import { useState } from "react";

import ImageDropzone from "../UI/ImageDropzone";
import LabeledInputField from "../UI/LabeledInputField";
import CatalogItemModel from "../../classes/CatalogItemModel";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/root-store-context";

const initValues = {
  name: "",
  price: "",
  weight: "",
  kcal: "",
  image: "",
};

const AddToCatalogPage = observer(() => {
  const { catalog } = useStore();
  const [inputValues, setInputValues] = useState(initValues);

  const handleItemAddition = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const fData = new FormData(target);
    const formObject = Object.fromEntries(fData.entries());
    const { name, price, weight, kcal } = formObject;

    /* temp for testing */
    catalog.addCatalogItem(
      new CatalogItemModel(name.toString(), +price, +weight, +kcal)
    );
    setInputValues(initValues);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "image") {
      const selectedFiles = e.target.files as FileList;
      const imageUrl = URL.createObjectURL(selectedFiles?.[0]);
      setInputValues({ ...inputValues, [name]: imageUrl });
    } else {
      setInputValues({ ...inputValues, [name]: value });
    }
  };

  const handleImageReset = () => {
    setInputValues({ ...inputValues, image: "" });
  };

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleItemAddition}>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <LabeledInputField
              title="Название"
              inputId="add-to-catalog-name"
              inputType="text"
              name="name"
              value={inputValues.name}
              onInputChange={handleValueChange}
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
              name="image"
              previewImage={inputValues.image}
              onInputChange={handleValueChange}
              onRemove={handleImageReset}
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
});
export default AddToCatalogPage;
