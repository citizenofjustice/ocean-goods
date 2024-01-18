import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Role } from "../types/Role";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeRole, updateRole } from "../api";
import RoleEdit from "./RoleEdit";
import { Privelege } from "../types/Privelege";

const RoleItem: React.FC<{
  priveleges: Privelege[];
  role: Role;
}> = ({ role, priveleges }) => {
  const [isInEdit, setIsInEdit] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const editModeHandler = () => {
    setIsInEdit((prevValue) => !prevValue);
  };

  const removeMutation = useMutation({
    mutationFn: async (id: number) => await removeRole(id),
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(["roles"], (oldData: Role[]) => {
        const newData = oldData.filter((item) => item.roleId !== variables);
        return newData;
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedRole: FormData) => await updateRole(updatedRole),
    onSuccess: () => {},
  });

  return (
    <>
      {!isInEdit && (
        <li className="flex bg-amber-50 rounded-lg items-center py-4 px-2 h-16 w-full gap-2">
          <p className="text-start justify-items-start basis-10/12 px-2">
            {role.title}
          </p>
          <div className="flex items-center basis-2/12 justify-center">
            <div className="flex flex-col items-center justify-center">
              <div onClick={editModeHandler}>
                <PencilSquareIcon className="w-6 h-6 hover:cursor-pointer" />
              </div>
            </div>
            <TrashIcon
              onClick={() => removeMutation.mutate(role.roleId)}
              className="w-6 h-6 hover:cursor-pointer"
            />
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
        />
      )}
    </>
  );
};

export default RoleItem;
