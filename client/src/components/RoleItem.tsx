import { z } from "zod";
import { useState } from "react";
import { AxiosError } from "axios";
import { FilePenLine, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/UI/shadcn/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Role } from "@/types/Role";
import { Privelege } from "@/types/Privelege";
import { zodRolesForm } from "@/lib/zodRolesForm";
import RolesDialog from "@/components/RolesDialog";
import { useStore } from "@/store/root-store-context";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import ConfirmActionAlert from "@/components/UI/ConfirmActionAlert";

const RoleItem: React.FC<{
  priveleges: Privelege[];
  role: Role;
}> = ({ role, priveleges }) => {
  // Initializing mobX store, queryClient for managing queries and axiosPrivate for requests with credentials
  const { alert } = useStore();
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const form = useForm<z.infer<typeof zodRolesForm>>({
    resolver: zodResolver(zodRolesForm),
    defaultValues: {
      title: role.title,
      privelegeIds: role.privelegeIds,
    },
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      setIsDialogOpen(false);
      // if query was successful invalidate query and refetch data
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
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
      form.reset();
    },
  });

  const onSubmit = (values: z.infer<typeof zodRolesForm>) => {
    const fData = new FormData();
    fData.append("title", values.title);
    fData.append("privelegeIds", JSON.stringify(values.privelegeIds));
    updateMutation.mutate(fData);
  };

  return (
    <>
      <li className="flex bg-background-50 border rounded-lg items-center py-4 px-2 h-16 w-full gap-2">
        <p className="text-start justify-items-start basis-10/12 px-2">
          {role.title}
        </p>
        <div className="flex gap-3">
          <RolesDialog
            form={form}
            isOpen={isDialogOpen}
            onOpen={() => setIsDialogOpen(true)}
            onClose={() => setIsDialogOpen(false)}
            onSubmit={onSubmit}
            priveleges={priveleges}
          >
            <FilePenLine className="w-6 h-6 text-primary-800 hover:cursor-pointer" />
          </RolesDialog>
          <ConfirmActionAlert
            question="Вы уверены что хотите удалить роль пользователя?"
            message="Удаление роли может повлечь за собой потерю доступа к некоторому функционалу для пользователей с данной ролью."
            onConfirm={() => removeMutation.mutate(role.roleId)}
          >
            <Button className="p-0" variant="link">
              <Trash2 className="w-6 h-6 text-primary-800 hover:cursor-pointer" />
            </Button>
          </ConfirmActionAlert>
        </div>
      </li>
    </>
  );
};

export default RoleItem;
