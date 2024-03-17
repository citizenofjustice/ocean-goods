import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/UI/shadcn/card";

import { Privelege } from "@/types/Privelege";
import ErrorPage from "@/components/Pages/ErrorPage";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

// Component for displaing the list of all available priveleges
const PrivelegesPage = () => {
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
              <p className="text-center font-medium">Перечень полномочий:</p>
            </CardHeader>
            <CardContent>
              <ul>
                {dataAvailable && data.length > 0 ? (
                  data.map((item: Privelege) => (
                    <li
                      className="bg-background-50 my-4 flex h-16 w-full items-center gap-2 rounded-lg border px-2 py-4"
                      key={item.privelegeId}
                    >
                      <p className="basis-10/12 justify-items-start px-2 text-start first-letter:capitalize">
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

export default PrivelegesPage;
