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
            <div className="my-8 font-body text-base flex flex-col items-center justify-center sm:flex-row sm:divide-x-2 sm:divide-solid sm:divide-background-700">
              <p className="sm:px-4">
                Дата заказа: <FormatDate createdAt={data.createdAt} />
              </p>
              <p className="sm:px-4">Заказчик: {data.customerName}</p>
              <p className="sm:px-4">Телефон: {data.customerPhone}</p>
            </div>
          )}
          {data.orderDetails && (
            <div className="m-2 sm:m-6 text-base">
              <ul className="max-w-5xl m-auto py-2 px-4 bg-background-200 rounded-xl">
                <div className="pb-2 font-body font-bold text-center text-2xl">
                  Состав заказа №{data.orderId}:
                </div>
                <li
                  className="min-w-[220px] overflow-x-auto scroll-smooth rounded-t-xl pb-1 "
                  id="order-page-h-scroll"
                >
                  <div className="grid grid-cols-[minmax(5rem,7rem)_repeat(4,minmax(9rem,500px))] divide-x divide-solid divide-gray-800 text-text-50 font-medium">
                    <span className="text-center p-2 bg-background-700">
                      Фото
                    </span>
                    <span className="text-center p-2 bg-background-700">
                      Наименование
                    </span>
                    <span className="text-center p-2 bg-background-700">
                      Тип продукта
                    </span>
                    <span className="text-center p-2 bg-background-700">
                      Количество
                    </span>
                    <span className="text-center p-2 bg-background-700">
                      Цена
                    </span>
                  </div>
                  <div className="w-fit font-body bg-background-50 divide-y divide-solid divide-gray-800 border-t border-gray-800">
                    {data.orderDetails.orderItems.map(
                      (orderItem: OrderItemWithTypeName) => (
                        <div
                          key={orderItem.productId}
                          className="grid grid-cols-[minmax(5rem,7rem)_repeat(4,minmax(9rem,500px))] divide-x divide-solid divide-gray-800"
                        >
                          <span className="p-2">
                            <div className="overflow-hidden border border-accent-700 rounded">
                              <img src={orderItem.mainImage} />
                            </div>
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
                    <div className="font-body text-center">
                      В заказе отсутствуют товары. Возможно произошла ошибка.
                    </div>
                  )}
                </li>
                {data.orderDetails.totalPrice && (
                  <li className="min-w-[220px] grid grid-cols-5 px-2 font-bold mt-2">
                    <p className="w-fit place-self-end col-span-5 font-body rounded-2xl py-1 px-2 border-2 bg-primary-100 border-accent-700">
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
