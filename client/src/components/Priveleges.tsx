import { useQuery } from "@tanstack/react-query";
import { Privelege } from "../types/Privelege";
import { getPriveleges } from "../api";

const Priveleges = () => {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["priveleges"],
    queryFn: async () => await getPriveleges(),
    refetchOnWindowFocus: false,
  });

  if (isError) return <h1>{error.message}</h1>;

  return (
    <>
      <h1>Priveleges</h1>
      {!isLoading && !isError && (
        <ul>
          {data.map((item: Privelege) => (
            <li key={item.privelegeId}>{item.title}</li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Priveleges;
