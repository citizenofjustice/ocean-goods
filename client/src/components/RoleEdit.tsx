import { useState } from "react";

import { Privelege } from "../types/Privelege";
import CustomCheckbox from "./ui/CustomCheckbox";
import LabeledInputField from "./ui/LabeledInputField";
import CustomAlertMessage from "./ui/CustomAlertMessage";
import { Button } from "./ui/button";
import { ButtonLoading } from "./ui/ButtonLoading";

// Define the type for the initial values of the form
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
  isPending: boolean;
}> = ({ initValues, priveleges, onFormClose, onFormSubmit, isPending }) => {
  const [inputValues, setInputValues] = useState(initValues); // State to manage the input values of the form
  const [checkboxAlert, setCheckboxAlert] = useState(""); // State to manage the alert message for the checkbox

  // Handler function to update the input values when they change
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  // Handler function to update the checkbox values when they change
  const handleCheckboxChange = (priveleges: number[]) => {
    setInputValues({ ...inputValues, privelegeIds: priveleges });
  };

  // Handler function to handle the submission of the form
  const handleEditSubmission = (
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) => {
    e.preventDefault();
    // if priveleges was not checked show alert message and stop execution
    if (inputValues.privelegeIds.length === 0) {
      setCheckboxAlert("Для роли не были выбраны полномочия");
      return;
    } else {
      setCheckboxAlert(""); // clear alert message
    }
    const fData = new FormData();
    // filling FormData with values
    fData.append("roleId", JSON.stringify(inputValues.roleId));
    fData.append("title", inputValues.title);
    fData.append("privelegeIds", JSON.stringify(inputValues.privelegeIds));
    onFormSubmit(fData);
  };

  return (
    <>
      <form onSubmit={handleEditSubmission}>
        <div className="flex flex-col items-center bg-background-50 p-4 rounded-lg">
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
          {priveleges && (
            <CustomCheckbox
              nameForIds={`${inputValues.title}-${inputValues.roleId}-priveleges`}
              content={priveleges}
              initValues={initValues.privelegeIds}
              onChange={handleCheckboxChange}
            />
          )}
          {checkboxAlert && <CustomAlertMessage message={checkboxAlert} />}
          <div className="flex gap-4">
            <Button onClick={onFormClose}>Отмена</Button>
            {isPending ? (
              <ButtonLoading />
            ) : (
              <Button type="submit">Сохранить</Button>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default RoleEdit;
