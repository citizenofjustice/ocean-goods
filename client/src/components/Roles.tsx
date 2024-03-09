import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

import RoleAdd from "./RoleAdd";
import RoleItem from "./RoleItem";
import FormCard from "./UI/FormCard";
import { Role } from "../types/Role";
import ErrorPage from "./Pages/ErrorPage";
import LoadingSpinner from "./UI/LoadingSpinner";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Roles = () => {
  // Use 'useAxiosPrivate' hook to get an instance of axios with credentials
  const axiosPrivate = useAxiosPrivate();
  const [isFormShown, setIsFormShown] = useState<boolean>(false); // State to manage the visibility of the form

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

  return (
    <>
      {!isError && ( // If there is no error in fetching roles
        <>
          {!privelegesQuery.isError && ( // If there is no error in fetching privileges
            <FormCard>
              {isLoading && <LoadingSpinner />}
              {!isLoading && (
                <>
                  <div className="w-full flex justify-center items-center relative mb-4">
                    <p className="font-medium">Список ролей:</p>
                    {!isFormShown && (
                      <div className="absolute right-0">
                        <PlusCircleIcon
                          onClick={() => setIsFormShown(true)}
                          className="w-8 h-8 text-primary-800 hover:cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                  <ul className="flex flex-col gap-4">
                    {isFormShown && (
                      <RoleAdd
                        onFormClose={() => setIsFormShown(false)}
                        priveleges={privelegesQuery.data}
                      />
                    )}
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
                </>
              )}
            </FormCard>
          )}
          {privelegesQuery.isError && ( // If there is an error in fetching privileges
            <ErrorPage
              error={privelegesQuery.error}
              customMessage="При загрузке полномочий произошла ошибка"
            />
          )}
        </>
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
