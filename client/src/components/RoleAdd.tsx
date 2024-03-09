import { useState } from "react";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Privelege } from "../types/Privelege";
import CustomCheckbox from "./ui/CustomCheckbox";
import { RoleInputs } from "../types/form-types";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import LabeledInputField from "./ui/LabeledInputField";
import { useStore } from "../store/root-store-context";
import CustomAlertMessage from "./ui/CustomAlertMessage";
import { Button } from "./ui/button";
import { ButtonLoading } from "./ui/ButtonLoading";

// Defining the initial values for role inputs
const emptyInitValues: RoleInputs = {
  title: "",
  privelegeIds: [],
};

const RoleAdd: React.FC<{
  onFormClose: () => void;
  priveleges: Privelege[];
}> = ({ onFormClose, priveleges }) => {
  // Initializing mobX store, queryClient for managing queries and axiosPrivate for requests with credentials
  const { alert } = useStore();
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  const [checkboxAlert, setCheckboxAlert] = useState(""); // State to manage the alert message for the checkbox
  const [inputValues, setInputValues] = useState(emptyInitValues); // State to manage the input values of the form

  // Mutation to add a role
  const mutation = useMutation({
    mutationFn: async (newRole: FormData) => {
      const response = await axiosPrivate.post(`/roles/create`, newRole);
      return response.data;
    },
    onSuccess: async () => {
      // if query was successful invalidate query and refetch data
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
      setInputValues(emptyInitValues); // reset input values
      onFormClose(); // hide form
    },
    onError: (error) => {
      // display error alert if request failed
      if (error instanceof AxiosError) {
        alert.setPopup({
          message: error.response?.data.error.message,
          type: "error",
        });
      } else
        alert.setPopup({
          message: "При добавлении нового типа произошла неизвестная ошибка",
          type: "error",
        });
    },
  });

  // Handler function to update the input values when they change
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  // Handler function to handle the submission of the form
  const handleRoleSubmission = (
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
    fData.append("title", inputValues.title);
    fData.append("privelegeIds", JSON.stringify(inputValues.privelegeIds));
    mutation.mutate(fData);
  };

  // Handler function to update the checkbox values when they change
  const handleCheckboxChange = (priveleges: number[]) => {
    setInputValues({ ...inputValues, privelegeIds: priveleges });
  };

  return (
    <>
      <form onSubmit={handleRoleSubmission}>
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
              nameForIds="priveleges"
              content={priveleges}
              onChange={handleCheckboxChange}
            />
          )}
          {checkboxAlert && <CustomAlertMessage message={checkboxAlert} />}
          <div className="flex gap-4">
            <Button onClick={onFormClose}>Отмена</Button>
            {mutation.isPending ? (
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

export default RoleAdd;
