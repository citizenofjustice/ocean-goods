import { z } from "zod";
import { useState } from "react";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { PlusCircleIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/UI/shadcn/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Role } from "@/types/Role";
import RoleItem from "@/components/RoleItem";
import { zodRolesForm } from "@/lib/zodRolesForm";
import RolesDialog from "@/components/RolesDialog";
import ErrorPage from "@/components/Pages/ErrorPage";
import { useStore } from "@/store/root-store-context";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

const Roles = () => {
  // Use 'useAxiosPrivate' hook to get an instance of axios with credentials
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { alert } = useStore();
  const form = useForm<z.infer<typeof zodRolesForm>>({
    resolver: zodResolver(zodRolesForm),
    defaultValues: {
      title: "",
      privelegeIds: [],
    },
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Query to fetch privileges
  const privelegesQuery = useQuery({
    queryKey: ["priveleges"],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/priveleges`);
      return response.data;
    },
    refetchOnWindowFocus: false,
    retry: false, // Do not retry on failure
  });

  // Query to fetch roles
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/roles`);
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  // Mutation to add a role
  const mutation = useMutation({
    mutationFn: async (newRole: FormData) => {
      const response = await axiosPrivate.post(`/roles/create`, newRole);
      return response.data;
    },
    onSuccess: async () => {
      // if query was successful invalidate query and refetch data
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
      form.reset(); // reset input values
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
          message: "При добавлении новой роли произошла неизвестная ошибка",
          type: "error",
        });
    },
  });

  const onSubmit = (values: z.infer<typeof zodRolesForm>) => {
    const fData = new FormData();
    fData.append("title", values.title);
    fData.append("privelegeIds", JSON.stringify(values.privelegeIds));
    mutation.mutate(fData);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Роли пользователей | {import.meta.env.VITE_MAIN_TITLE}</title>
        <meta
          name="description"
          content="Список ролей пользователей с возможностью добавления, редактирования и удаления."
        />
      </Helmet>
      {!isError && ( // If there is no error in fetching roles
        <Card className="mt-4 w-full">
          {!privelegesQuery.isError && ( // If there is no error in fetching privileges
            <>
              {isLoading && <LoadingSpinner />}
              {!isLoading && (
                <>
                  <CardHeader className="font-medium">
                    <div className="flex w-full items-center justify-between">
                      <p className="font-medium">Список ролей:</p>
                      <RolesDialog
                        form={form}
                        isOpen={isDialogOpen}
                        onOpen={() => setIsDialogOpen(true)}
                        onClose={() => setIsDialogOpen(false)}
                        onSubmit={onSubmit}
                        priveleges={privelegesQuery.data}
                      >
                        <PlusCircleIcon className="h-8 w-8 hover:cursor-pointer" />
                      </RolesDialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="flex flex-col gap-4">
                      {data.length !== 0 ? (
                        data.map((item: Role) => (
                          <RoleItem
                            priveleges={privelegesQuery.data}
                            key={item.roleId}
                            role={item}
                          />
                        ))
                      ) : (
                        <h1 className="mt-4">Список ролей пуст</h1>
                      )}
                    </ul>
                  </CardContent>
                </>
              )}
            </>
          )}
          {privelegesQuery.isError && ( // If there is an error in fetching privileges
            <ErrorPage
              error={privelegesQuery.error}
              customMessage="При загрузке полномочий произошла ошибка"
            />
          )}
        </Card>
      )}
      {isError && ( // If there is an error in fetching roles
        <ErrorPage
          error={error}
          customMessage="При загрузке списка ролей произошла ошибка"
        />
      )}
    </>
  );
};

export default Roles;
