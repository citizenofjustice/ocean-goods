import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import LoadingSpinner from "./UI/LoadingSpinner";
import { Order } from "../types/Order";
import { useState } from "react";
import { useDebounce } from "usehooks-ts";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
registerLocale("ru", ru);

interface SortBy {
  orderBy: string;
  direction: string;
}

const initSortValues: SortBy = {
  orderBy: "",
  direction: "",
};

interface FilterProp {
  fieldName: "id" | "customer_name";
}

const OrdersList = () => {
  const axiosPrivate = useAxiosPrivate();
  const [isFiltersShown, setIsFiltersShown] = useState<boolean>(false);
  const [filterProp, setFilterProp] = useState<FilterProp>({
    fieldName: "id",
  });
  const [dateRange, setDateRange] = useState<Date[] | null[]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [filterBy, setFilterBy] = useState<string>("");
  const [sortBy, setSortBy] = useState(initSortValues);
  const debounceFilter = useDebounce(filterBy, 750);
  const debounceSort = useDebounce(sortBy, 750);

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["orders", debounceFilter, debounceSort, endDate, filterProp],
    queryFn: async () => {
      const params = new URLSearchParams([]);

      // Add parameters to the URL search parameters if they exist
      if (startDate && endDate) {
        params.append("startDate", startDate.toISOString());
        params.append("endDate", endDate.toISOString());
      }
      if (debounceFilter) {
        params.append("filterType", filterProp.fieldName);
        params.append("filter", debounceFilter);
      }
      if (debounceSort.orderBy && debounceSort.direction) {
        params.append("orderBy", debounceSort.orderBy);
        params.append("direction", debounceSort.direction);
      }

      try {
        // Make the API call and return the data
        const response = await axiosPrivate.get(`/orders/all`, { params });
        return response.data;
      } catch (error) {
        // Handle any errors
        console.error(error);
        throw new Error("An error occurred while fetching the orders.");
      }
    },
    refetchOnWindowFocus: false,
  });

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const values = value.split("/");
    setSortBy({ orderBy: values[0], direction: values[1] });
  };

  const handleCheckboxChange = () => {
    switch (filterProp.fieldName) {
      case "id": {
        setFilterProp({ fieldName: "customer_name" });
        break;
      }
      case "customer_name": {
        setFilterProp({ fieldName: "id" });
        break;
      }
      default: {
        setFilterProp({ fieldName: "id" });
        break;
      }
    }
  };

  if (isError) return <div>{error.message}</div>;

  return (
    <>
      <div className="flex flex-col items-center justify-center mb-4">
        {isFiltersShown ? (
          <>
            <div className="mb-4">
              <ChevronUpIcon
                onClick={() => setIsFiltersShown(false)}
                className="w-6 h-6 hover:cursor-pointer"
              />
            </div>
            <form className="flex lg:flex-row flex-col lg:gap-8 gap-4 mx-4">
              <div className="flex lg:flex-col vsm:flex-row flex-col gap-2 items-center">
                <label
                  className="align-middle h-fit basis-1/2"
                  htmlFor="order-customer-filter"
                >
                  Сортировать по:
                </label>
                <select
                  name="sortSelect"
                  defaultValue="по дате (убыв.)"
                  className="basis-1/2 lowercase border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block sm:min-w-[120px] p-2.5"
                  onChange={handleSelect}
                >
                  <option value="created_at/DESC">
                    по дате (убыв.) &#8595;
                  </option>
                  <option value="created_at/ASC">
                    по дате (возр.) &#8593;
                  </option>
                  <option value="customer_name/DESC">
                    по имени (убыв.) &#8595;
                  </option>
                  <option value="customer_name/ASC">
                    по имени (возр.) &#8593;
                  </option>
                  <option value="totalPrice/DESC">
                    по цене (убыв.) &#8595;
                  </option>
                  <option value="totalPrice/ASC">
                    по цене (возр.) &#8593;
                  </option>
                </select>
              </div>
              <div className="flex lg:flex-col vsm:flex-row flex-col gap-2 items-center">
                <label className="basis-1/2" htmlFor="order-datepicker">
                  Фильтр по дате:
                </label>
                <ReactDatePicker
                  id="order-datepicker"
                  className="basis-1/2 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block min-w-[200px] p-2.5"
                  locale={ru}
                  dateFormat="dd/MM/yyyy"
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
              <div className="flex vsm:flex-row flex-col gap-2 items-center vsm:items-end">
                <label className="basis-1/2" htmlFor="order-filter">
                  <div>Фильтрация по:</div>
                  <div className="grid grid-cols-6">
                    <input
                      id="order-filter-id"
                      type="checkbox"
                      checked={filterProp.fieldName === "id"}
                      onChange={handleCheckboxChange}
                      className="w-fit col-span-1"
                    />
                    <label htmlFor="order-filter-id" className="col-span-5">
                      по номеру заказа
                    </label>
                    <input
                      id="order-filter-customer"
                      type="checkbox"
                      checked={filterProp.fieldName === "customer_name"}
                      onChange={handleCheckboxChange}
                      className="w-fit col-span-1"
                    />
                    <label
                      htmlFor="order-filter-customer"
                      className="col-span-5"
                    >
                      по имени заказчика
                    </label>
                  </div>
                </label>
                <input
                  id="order-filter"
                  name="filter"
                  className="basis-1/2 h-fit border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block sm:min-w-[120px] p-2.5"
                  placeholder="Введите искомое значение"
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                />
              </div>
            </form>
          </>
        ) : (
          <span
            onClick={() => setIsFiltersShown(true)}
            className="flex gap-2  hover:cursor-pointer"
          >
            <p>Сортировка и поиск</p>
            <ChevronDownIcon className="w-6 h-6" />
          </span>
        )}
      </div>
      {isLoading && <LoadingSpinner />}
      {!isLoading && !isError && (
        <div className="flex justify-center">
          <ul className="bg-gray-200 rounded-xl mx-4 w-full max-w-lg divide-y-2 divide-solid divide-white">
            {data &&
              data.map((item: Order) => (
                <li
                  className="p-3 grid vsm:gap-x-6 vsm:grid-cols-2 grid-cols-1 gap-x-2 gap-y-2 items-center"
                  key={item.orderId}
                >
                  <p className="font-bold">Заказ №{item.orderId}</p>
                  <p className="">
                    от <FormatDate createdAt={item.createdAt} />
                  </p>
                  <p className="">Имя заказчика: {item.customerName}</p>
                  <p>Тел.: {item.customerPhone}</p>
                  <p className="border w-fit rounded-xl p-1 border-gray-700 text-center">
                    Сумма заказа: {item.orderDetails.totalPrice} руб.
                  </p>
                  <Link
                    className="underline place-self-end"
                    to={`/orders/${item.orderId}`}
                  >
                    подробнее...
                  </Link>
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
  const dateWithTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString(
    [],
    { hour: "2-digit", minute: "2-digit" }
  )}`;

  return <>{dateWithTime}</>;
};
