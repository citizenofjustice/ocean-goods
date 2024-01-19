import { useState } from "react";
import LabeledInputField from "./UI/LabeledInputField";
import CustomCheckbox from "./UI/CustomCheckbox";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRole, getPriveleges } from "../api";
import DefaultButton from "./UI/DefaultButton";
import { RoleInputs } from "../types/form-types";
import LoadingSpinner from "./UI/LoadingSpinner";
import CustomAlertMessage from "./UI/CustomAlertMessage";

const emptyInitValues: RoleInputs = {
  title: "",
  privelegeIds: [],
};

const RoleAdd: React.FC<{
  onFormClose: () => void;
}> = ({ onFormClose }) => {
  const [inputValues, setInputValues] = useState(emptyInitValues);
  const [checkboxAlert, setCheckboxAlert] = useState("");
  const queryClient = useQueryClient();

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["priveleges"],
    queryFn: async () => await getPriveleges(),
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: async (fData: FormData) => await createRole(fData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
      setInputValues(emptyInitValues);
      onFormClose();
    },
  });

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleRoleSubmission = (
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) => {
    e.preventDefault();
    if (inputValues.privelegeIds.length === 0) {
      setCheckboxAlert("Для роли не были выбраны полномочия");
      return;
    } else {
      setCheckboxAlert("");
    }
    const fData = new FormData();
    fData.append("title", inputValues.title);
    fData.append("privelegeIds", JSON.stringify(inputValues.privelegeIds));
    mutation.mutate(fData);
  };

  const handleCheckboxChange = (priveleges: number[]) => {
    setInputValues({ ...inputValues, privelegeIds: priveleges });
  };

  if (error) return <h1>{error.message}</h1>;

  return (
    <>
      <form onSubmit={handleRoleSubmission}>
        <div className="flex flex-col items-center bg-amber-50 p-4 rounded-lg">
          <div className="w-4/5">
            <LabeledInputField
              inputId="user-role-title"
              inputType="text"
              name="title"
              title="Роль пользователя"
              value={inputValues.title}
              onInputChange={handleValueChange}
            />
          </div>
          {isLoading && <LoadingSpinner />}
          {!isLoading && !isError && (
            <CustomCheckbox
              nameForIds="priveleges"
              content={data}
              onChange={handleCheckboxChange}
            />
          )}
          {checkboxAlert && <CustomAlertMessage message={checkboxAlert} />}
          <div className="flex gap-4">
            <DefaultButton type="button" onClick={onFormClose}>
              Отмена
            </DefaultButton>
            <DefaultButton type="submit">Сохранить</DefaultButton>
          </div>
        </div>
      </form>
    </>
  );
};

export default RoleAdd;
