import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const OrderPage = () => {
  const params = useParams();
  const axiosPrivate = useAxiosPrivate();
  const { id } = params;

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["order"],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/orders/${id}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  if (isError) return <h1>{error.message}</h1>;

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && !isError && (
        <>{data && <div>Order №{data.orderId}</div>}</>
      )}
    </>
  );
};

export default OrderPage;
