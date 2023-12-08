import LabeledInputField from "../UI/LabeledInputField";
// import { CatalogItem } from "../../types/CatalogItem";

interface InputFields {
  title: string;
  inputId: string;
  inputType: string;
}

const formInputs: InputFields[] = [
  { title: "Название", inputId: "add-to-catalog-name", inputType: "text" },
  { title: "Цена", inputId: "add-to-catalog-price", inputType: "number" },
  { title: "Вес", inputId: "add-to-catalog-weight", inputType: "number" },
  {
    title: "Ккал (на 100 гр.)",
    inputId: "add-to-catalog-kcal",
    inputType: "number",
  },
  { title: "Изображение", inputId: "add-to-catalog-image", inputType: "file" },
];

const AddToCatalogPage = () => {
  return (
    <>
      <div className="p-4">
        <form>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            {formInputs.map((input) => (
              <LabeledInputField
                key={input.inputId}
                title={input.title}
                inputId={input.inputId}
                inputType={input.inputType}
              />
            ))}
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
};

export default AddToCatalogPage;
