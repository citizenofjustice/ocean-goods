import { Link } from "react-router-dom";
import { Order } from "../types/Order";
import { useMediaQuery } from "usehooks-ts";
import FormatDate from "./FormatDate";

const OrdersListItem: React.FC<{
  order: Order;
}> = ({ order }) => {
  const matches = useMediaQuery("(min-width: 1024px)");

  return (
    <>
      <li className="lg:bg-background-700 text-text-800 p-2 vsm:p-4 lg:p-0 grid gap-x-2 gap-y-1 vsm:gap-x-6 lg:gap-x-[2px] grid-cols-1 vsm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,500px))_minmax(5rem,9rem)] items-center">
        <div className="bg-background-50 lg:py-2 lg:px-4 grid vsm:gap-x-6 grid-cols-subgrid vsm:col-span-2 vsm:grid-cols-2 lg:col-span-1 lg:block">
          <p className="font-bold text-center vsm:text-start">
            Заказ №{order.orderId}
          </p>
          <p className="text-center vsm:text-start text-xs vsm:text-base">
            от <FormatDate createdAt={order.createdAt} />
          </p>
        </div>
        <p className="bg-background-50 lg:py-2 lg:px-4 h-full mt-2 vsm:mt-0 flex flex-col justify-center">
          {!matches && "Имя заказчика: "}
          {order.customerName}
        </p>
        <p className="bg-background-50 lg:py-2 lg:px-4 h-full flex flex-col justify-center">
          {!matches && "Тел.: "}
          {order.customerPhone}
        </p>
        <div className="bg-background-50 lg:py-2 lg:px-4 h-full flex flex-col justify-center">
          <p className="rounded-xl px-4 py-1 text-start bg-accent-200 text-text-800 font-medium w-fit mt-2 lg:mt-0">
            {!matches && "Сумма заказа: "}
            {order.orderDetails.totalPrice}&nbsp;руб.
          </p>
        </div>
        <Link
          className="bg-background-50 lg:py-2 lg:px-4 h-full text-text-600 hover:text-accent-800 font-bold underline text-end lg:text-center flex flex-col justify-end lg:justify-center"
          to={`/orders/${order.orderId}`}
        >
          подробнее...
        </Link>
      </li>
    </>
  );
};

export default OrdersListItem;
