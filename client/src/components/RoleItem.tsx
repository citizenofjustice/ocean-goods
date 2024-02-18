import { useState } from "react";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

import RoleEdit from "./RoleEdit";
import { Role } from "../types/Role";
import { Privelege } from "../types/Privelege";
import { useStore } from "../store/root-store-context";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const RoleItem: React.FC<{
  priveleges: Privelege[];
  role: Role;
}> = ({ role, priveleges }) => {
  // Initializing mobX store, queryClient for managing queries and axiosPrivate for requests with credentials
  const { alert } = useStore();
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const [isInEdit, setIsInEdit] = useState<boolean>(false); // State to manage the edit mode

  // Handler function to toggle the edit mode
  const editModeHandler = () => {
    setIsInEdit((prevValue) => !prevValue);
  };

  // Mutation to remove a role
  const removeMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosPrivate.delete(`/roles/${id}`);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      // if query was successful modify query data
      queryClient.setQueryData(["roles"], (oldData: Role[]) => {
        const newData = oldData.filter((item) => item.roleId !== variables);
        return newData;
      });
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
          message: "При добавлении удалении роли произошла неизвестная ошибка",
          type: "error",
        });
    },
  });

  // Mutation to update a role
  const updateMutation = useMutation({
    mutationFn: async (updatedRole: FormData) => {
      const response = await axiosPrivate.put(
        `/roles/${role.roleId}`,
        updatedRole
      );
      return response.data;
    },
    onSuccess: async () => {
      // if query was successful invalidate query and refetch data
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
      setIsInEdit(false);
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
          message: "При изменении роли произошла неизвестная ошибка",
          type: "error",
        });
    },
  });

  return (
    <>
      {!isInEdit && (
        <li className="flex bg-background-50 rounded-lg items-center py-4 px-2 h-16 w-full gap-2">
          <p className="text-start justify-items-start basis-10/12 px-2">
            {role.title}
          </p>
          <div className="flex items-center basis-2/12 justify-center">
            <div className="flex flex-row items-center justify-center gap-1">
              <div onClick={editModeHandler}>
                <PencilSquareIcon className="w-6 h-6 text-primary-800 hover:cursor-pointer" />
              </div>
              <TrashIcon
                onClick={() => removeMutation.mutate(role.roleId)}
                className="w-6 h-6 text-primary-800 hover:cursor-pointer"
              />
            </div>
          </div>
        </li>
      )}
      {isInEdit && (
        <RoleEdit
          initValues={{
            roleId: role.roleId,
            title: role.title,
            privelegeIds: role.priveleges.map((item) => item.privelegeId),
          }}
          priveleges={priveleges}
          onFormClose={() => setIsInEdit(false)}
          onFormSubmit={(updatedRole: FormData) =>
            updateMutation.mutate(updatedRole)
          }
          isPending={updateMutation.isPending}
        />
      )}
    </>
  );
};

export default RoleItem;
