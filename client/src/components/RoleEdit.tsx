import { useState } from "react";
import DefaultButton from "./UI/DefaultButton";
import LabeledInputField from "./UI/LabeledInputField";
import CustomCheckbox from "./UI/CustomCheckbox";
import { Privelege } from "../types/Privelege";
import CustomAlertMessage from "./UI/CustomAlertMessage";

interface editRoleInputs {
  roleId: number;
  title: string;
  privelegeIds: number[];
}

const RoleEdit: React.FC<{
  initValues: editRoleInputs;
  priveleges: Privelege[];
  onFormClose: () => void;
  onFormSubmit: (updatedRole: FormData) => void;
}> = ({ initValues, priveleges, onFormClose, onFormSubmit }) => {
  const [inputValues, setInputValues] = useState(initValues);
  const [checkboxAlert, setCheckboxAlert] = useState("");

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleCheckboxChange = (priveleges: number[]) => {
    setInputValues({ ...inputValues, privelegeIds: priveleges });
  };

  const handleEditSubmission = (
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
    fData.append("roleId", JSON.stringify(inputValues.roleId));
    fData.append("title", inputValues.title);
    fData.append("privelegeIds", JSON.stringify(inputValues.privelegeIds));
    onFormSubmit(fData);
  };

  return (
    <>
      <form onSubmit={handleEditSubmission}>
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
          <CustomCheckbox
            nameForIds={`${inputValues.title}-${inputValues.roleId}-priveleges`}
            content={priveleges}
            initValues={initValues.privelegeIds}
            onChange={handleCheckboxChange}
          />
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

export default RoleEdit;
