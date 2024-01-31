import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import LoadingSpinner from "./UI/LoadingSpinner";
import { Order } from "../types/Order";
import { useState } from "react";
import { useDebounce } from "usehooks-ts";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("ru", ru);

interface SortBy {
  orderBy: string;
  direction: string;
}

const initSortValues: SortBy = {
  orderBy: "",
  direction: "",
};

const OrdersList = () => {
  const axiosPrivate = useAxiosPrivate();
  const [dateRange, setDateRange] = useState<Date[] | null[]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [filterBy, setFilterBy] = useState<string>("");
  const [sortBy, setSortBy] = useState(initSortValues);
  const debounceFilter = useDebounce(filterBy, 750);
  const debounceSort = useDebounce(sortBy, 750);

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["orders", debounceFilter, debounceSort, endDate],
    queryFn: async () => {
      const params = new URLSearchParams([]);
      if (startDate && endDate) {
        params.append("startDate", startDate.toISOString());
        params.append("endDate", endDate.toISOString());
      }
      if (debounceFilter) params.append("filter", debounceFilter);
      if (debounceSort.orderBy && debounceSort.direction) {
        params.append("orderBy", debounceSort.orderBy);
        params.append("direction", debounceSort.direction);
      }
      const response = await axiosPrivate.get(`/order/all`, { params });
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const values = value.split("/");
    console.log({ orderBy: values[0], direction: values[1] });

    setSortBy({ orderBy: values[0], direction: values[1] });
  };

  if (isError) return <div>{error.message}</div>;

  return (
    <>
      <div className="flex justify-center mb-4">
        <form className="flex justify-center items-center flex-col sm:flex-row gap-4 w-4/5">
          <div className="flex sm:flex-col flex-row gap-2 text-center sm:min-w-[200px]">
            <label htmlFor="order-datepicker">Фильтр по дате:</label>
            <ReactDatePicker
              id="order-datepicker"
              className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              locale={ru}
              placeholderText="Укажите временной период"
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update: [Date, Date]) => {
                setDateRange(update);
              }}
              isClearable={true}
            />
          </div>
          <div className="flex sm:flex-col flex-row gap-2 text-center sm:min-w-[120px]">
            <label htmlFor="order-customer-filter">Фильтрация по имени:</label>
            <input
              id="order-customer-filter"
              name="filter"
              className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Фильтрация по имени"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
            />
          </div>
          <div className="flex sm:flex-col flex-row gap-2 text-center sm:min-w-[120px]">
            <label htmlFor="order-customer-filter">Сортировать по:</label>
            <select
              name="sortSelect"
              defaultValue="по дате (убыв.)"
              className="lowercase border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={handleSelect}
            >
              <option value="created_at/DESC">по дате (убыв.) &#8595;</option>
              <option value="created_at/ASC">по дате (возр.) &#8593;</option>
              <option value="customer_name/DESC">
                по имени (убыв.) &#8595;
              </option>
              <option value="customer_name/ASC">
                по имени (возр.) &#8593;
              </option>
              <option value="totalPrice/DESC">по цене (убыв.) &#8595;</option>
              <option value="totalPrice/ASC">по цене (возр.) &#8593;</option>
            </select>
          </div>
        </form>
      </div>
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
