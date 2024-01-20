import { useQuery } from "@tanstack/react-query";
import { getPriveleges, getRoles } from "../api";
import { Role } from "../types/Role";
import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "./UI/LoadingSpinner";
import RoleAdd from "./RoleAdd";
import RoleItem from "./RoleItem";
import FormCard from "./UI/FormCard";

const Roles = () => {
  const privelegesQuery = useQuery({
    queryKey: ["priveleges"],
    queryFn: async () => {
      const data = await getPriveleges();
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => await getRoles(),
    refetchOnWindowFocus: false,
  });

  const [isFormShown, setIsFormShown] = useState<boolean>(false);

  if (isError) return <h1>{error.message}</h1>;

  return (
    <>
      <FormCard>
        {isLoading && <LoadingSpinner />}
        {!isLoading && !isError && (
          <>
            <div className="w-full flex justify-center relative mb-4">
              <p className="font-bold">Список ролей:</p>
              {!isFormShown && (
                <div className="absolute right-0">
                  <PlusCircleIcon
                    onClick={() => setIsFormShown(true)}
                    className="w-6 h-6 hover:cursor-pointer"
                  />
                </div>
              )}
            </div>
            <ul className="flex flex-col gap-4">
              {isFormShown && (
                <RoleAdd onFormClose={() => setIsFormShown(false)} />
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
    </>
  );
};

export default Roles;
