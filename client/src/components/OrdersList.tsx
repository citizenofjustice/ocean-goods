import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import LoadingSpinner from "./UI/LoadingSpinner";
import { Order } from "../types/Order";

const OrdersList = () => {
  const axiosPrivate = useAxiosPrivate();

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/order/all`);
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  if (isError) return <div>{error.message}</div>;

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && !isError && (
        <div className="flex justify-center">
          <ul className="bg-gray-200 rounded-xl w-3/5 divide-y-2 divide-solid divide-white">
            {data.map((item: Order) => (
              <li className="p-4 flex flex-col" key={item.orderId}>
                <div className="flex justify-between gap-8">
                  <p>Заказ №{item.orderId}</p>
                  <p>Имя заказчика: {item.customerName}</p>
                </div>
                <div className="flex justify-between gap-8">
                  <p>
                    <FormatDate createdAt={item.createdAt} />
                  </p>
                  <p>Сумма заказа: {item.orderDetails.totalPrice} руб.</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default OrdersList;

const FormatDate: React.FC<{
  createdAt: string;
}> = ({ createdAt }) => {
  const date = new Date(createdAt);
  const dateWithTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

  return <>{dateWithTime}</>;
};
