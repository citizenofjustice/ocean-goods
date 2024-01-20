import { useQuery } from "@tanstack/react-query";
import { Privelege } from "../types/Privelege";
import { getPriveleges } from "../api";
import LoadingSpinner from "./UI/LoadingSpinner";
import FormCard from "./UI/FormCard";

const Priveleges = () => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["priveleges"],
    queryFn: async () => await getPriveleges(),
    refetchOnWindowFocus: false,
  });

  if (isError) return <h1>{error.message}</h1>;

  return (
    <>
      <FormCard>
        {isLoading && <LoadingSpinner />}
        {!isLoading && !isError && (
          <>
            <p className="font-bold">Перечень полномочий:</p>
            <ul>
              {data.length !== 0 ? (
                data.map((item: Privelege) => (
                  <li
                    className="flex bg-amber-50 rounded-lg items-center my-4 py-4 px-2 h-16 w-full gap-2"
                    key={item.privelegeId}
                  >
                    <p className="text-start justify-items-start basis-10/12 px-2 first-letter:capitalize">
                      {item.title}
                    </p>
                  </li>
                ))
              ) : (
                <h1 className="mt-4">Список полномочий пуст</h1>
              )}
            </ul>
          </>
        )}
      </FormCard>
    </>
  );
};

export default Priveleges;
