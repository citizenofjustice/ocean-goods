import { useState } from "react";
import LabeledInputField from "./UI/LabeledInputField";
import CustomCheckbox from "./UI/CustomCheckbox";
import { useQuery } from "@tanstack/react-query";
import { getPriveleges } from "../api";
import DefaultButton from "./UI/DefaultButton";
import { RoleInputs } from "../types/form-types";

const emptyInitValues: RoleInputs = {
  title: "",
  privelegeIds: [],
};

const RoleAdd = () => {
  const [inputValues, setInputValues] = useState(emptyInitValues);
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["priveleges"],
    queryFn: async () => await getPriveleges(),
    refetchOnWindowFocus: false,
  });

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleRoleSubmission = (
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) => {
    e.preventDefault();
    const fData = new FormData(e.currentTarget);
    // fData.append("privelegeIds", JSON.stringify(inputValues.privelegeIds));
    console.log(Object.fromEntries(fData));
  };

  // const isChecked = () => {
  //   return
  // }
  const handleCheckboxChange = (priveleges: number[]) => {
    console.log(priveleges);
    // setInputValues({ ...inputValues, privelegeIds: priveleges });
  };

  if (error) return <h1>{error.message}</h1>;

  return (
    <>
      <form onSubmit={handleRoleSubmission}>
        <div className="flex flex-col items-center bg-amber-50 p-2 rounded-lg">
          <LabeledInputField
            inputId="user-role-title"
            inputType="text"
            name="title"
            title="Роль пользователя"
            value={inputValues.title}
            onInputChange={handleValueChange}
          />
          {!isLoading && !isError && (
            <CustomCheckbox content={data} onChange={handleCheckboxChange} /> //
          )}
          <DefaultButton type="submit">Сохранить</DefaultButton>
        </div>
      </form>
    </>
  );
};

export default RoleAdd;
