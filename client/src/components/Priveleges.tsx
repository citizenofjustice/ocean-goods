import { useQuery } from "@tanstack/react-query";

import ErrorPage from "./Pages/ErrorPage";
import { Privelege } from "../types/Privelege";
import LoadingSpinner from "./UI/LoadingSpinner";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Card, CardContent, CardHeader } from "./UI/card";

// Component for displaing the list of all available priveleges
const Priveleges = () => {
  // Using a custom hook to get an axios instance with credentials enabled
  const axiosPrivate = useAxiosPrivate();

  // Using the useQuery hook from react-query to fetch priveleges
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["priveleges"],
    queryFn: async () => {
      // Fetching priveleges data from the server
      const response = await axiosPrivate.get(`/priveleges`);
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  // prevent potential errors if the request fails and data is undefined
  const dataAvailable = data !== null && data !== undefined;

  return (
    <>
      <Card className="mt-4 w-full">
        {isLoading && <LoadingSpinner />}
        {!isLoading && !isError && (
          <>
            <CardHeader>
              <p className="font-medium">Перечень полномочий:</p>
            </CardHeader>
            <CardContent>
              <ul>
                {dataAvailable && data.length > 0 ? (
                  data.map((item: Privelege) => (
                    <li
                      className="flex border bg-background-50 rounded-lg items-center my-4 py-4 px-2 h-16 w-full gap-2"
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
            </CardContent>
          </>
        )}
        {isError && (
          <ErrorPage
            error={error}
            customMessage="При загрузке списка привелегий произошла ошибка"
          />
        )}
      </Card>
    </>
  );
};

export default Priveleges;
