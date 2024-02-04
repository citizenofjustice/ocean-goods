import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import FormatDate from "../FormatDate";
import { OrderItem } from "../../types/OrderItem";
import LoadingSpinner from "../UI/LoadingSpinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

interface OrderItemWithTypeName extends OrderItem {
  type: string;
}

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
            <div className="my-8 font-body text-base flex flex-col items-center justify-center sm:flex-row sm:divide-x sm:divide-solid sm:divide-background-400">
              <p className="sm:px-4">
                Дата заказа: <FormatDate createdAt={data.createdAt} />
              </p>
              <p className="sm:px-4">Заказчик: {data.customerName}</p>
              <p className="sm:px-4">Телефон: {data.customerPhone}</p>
            </div>
          )}
          {data.orderDetails && (
            <div className="m-2 sm:m-6 font-body text-base">
              <ul className="max-w-5xl m-auto py-2 px-2 bg-secondary-50 rounded-xl">
                <div className="pb-2 font-bold text-center font-heading text-xl">
                  Состав заказа №{data.orderId}:
                </div>
                <li
                  className="min-w-[220px] overflow-x-auto scroll-smooth rounded-t-xl"
                  id="style-7"
                >
                  <div className="grid grid-cols-[minmax(5rem,7rem)_repeat(4,minmax(7rem,500px))] divide-x divide-solid divide-background-400">
                    <span className="text-center p-2 bg-primary-200">Фото</span>
                    <span className="text-center p-2 bg-primary-200">
                      Наименование
                    </span>
                    <span className="text-center p-2 bg-primary-200">
                      Тип продукта
                    </span>
                    <span className="text-center p-2 bg-primary-200">
                      Количество
                    </span>
                    <span className="text-center p-2 bg-primary-200">Цена</span>
                  </div>
                  <div className="w-fit divide-y divide-solid divide-background-400 border-t border-b border-background-400 mb-1">
                    {data.orderDetails.orderItems.map(
                      (orderItem: OrderItemWithTypeName) => (
                        <div
                          key={orderItem.productId}
                          className="grid grid-cols-[minmax(5rem,7rem)_repeat(4,minmax(7rem,500px))] divide-x divide-solid divide-background-400"
                        >
                          <span className="p-2">
                            <img src={orderItem.mainImage} />
                          </span>
                          <span className="p-2 text-wrap">
                            {orderItem.productName}
                          </span>
                          <span className="p-2 text-wrap">
                            {orderItem.type}
                          </span>
                          <span className="p-2 text-wrap">
                            {orderItem.amount}
                          </span>
                          <span className="p-2 text-wrap">
                            {orderItem.totalProductPrice} руб.
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  {data.orderDetails.orderItems.length === 0 && (
                    <div>
                      В заказе отсутствуют товары. Возможно произошла ошибка.
                    </div>
                  )}
                </li>
                {data.orderDetails.totalPrice && (
                  <li className="min-w-[220px] grid grid-cols-5 px-2 font-bold">
                    <p className="col-span-5 text-end pt-2">
                      Общая сумма заказа: {data.orderDetails.totalPrice} руб.
                    </p>
                  </li>
                )}
              </ul>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default OrderPage;
