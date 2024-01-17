import { useQuery } from "@tanstack/react-query";
import { getRoles } from "../api";
import { Role } from "../types/Role";
import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "./UI/LoadingSpinner";
import RoleAdd from "./RoleAdd";

const Roles = () => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => await getRoles(),
    refetchOnWindowFocus: false,
  });
  const [isFormShown, setIsFormShown] = useState<boolean>(false);

  if (isError) return <h1>{error.message}</h1>;

  return (
    <>
      <div className="text-center vvsm:w-4/5 min-w-56 max-w-md bg-gray-200 rounded-lg p-4">
        {isLoading && <LoadingSpinner />}
        {!isLoading && !isError && (
          <>
            <div className="w-full flex justify-center relative">
              <p className="font-bold">Роли</p>
              {!isFormShown && (
                <div className="absolute right-0">
                  <PlusCircleIcon
                    onClick={() => setIsFormShown(true)}
                    className="w-6 h-6 hover:cursor-pointer"
                  />
                </div>
              )}
            </div>
            <ul>
              {isFormShown && (
                <li>
                  <RoleAdd />
                </li>
              )}
              {data.length !== 0 ? (
                data.map((item: Role) => (
                  <li key={item.roleId}>{item.title}</li>
                ))
              ) : (
                <h1 className="mt-4">Список ролей пуст</h1>
              )}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default Roles;
