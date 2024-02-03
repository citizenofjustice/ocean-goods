import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { OrderItem } from "../../types/OrderItem";

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
        <>
          {data && (
            <div>
              <ul>
                <li className="grid grid-cols-5 gap-2">
                  <span>Фото</span>
                  <span>Наименование</span>
                  <span>Тип продукта</span>
                  <span>Количество</span>
                  <span>Цена</span>
                </li>
                {data.orderDetails.orderItems.map((orderItem: OrderItem) => (
                  <li
                    key={orderItem.productId}
                    className="grid grid-cols-5 gap-2"
                  >
                    <span>
                      <img src={orderItem.mainImage} />
                    </span>
                    <span>{orderItem.productName}</span>
                    <span>{orderItem.productTypeId}</span>
                    <span>{orderItem.amount}</span>
                    <span>{orderItem.totalProductPrice} руб.</span>
                  </li>
                ))}
                {data.orderDetails.totalPrice && (
                  <li className="grid grid-cols-5 gap-2">
                    <p className="col-span-4 text-end">Общая сумма заказа:</p>
                    <p className="">{data.orderDetails.totalPrice} руб.</p>
                  </li>
                )}
                {}
              </ul>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default OrderPage;
