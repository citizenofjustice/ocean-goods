import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Order } from "../types/Order";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  useDebounce,
  useIntersectionObserver,
  useMediaQuery,
} from "usehooks-ts";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import FormatDate from "./FormatDate";
import LoadingSpinner from "./UI/LoadingSpinner";
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
  const limit = 10;
  const ref = useRef<HTMLDivElement>(null);
  const debounceFilter = useDebounce(filterBy, 750);
  const debounceSort = useDebounce(sortBy, 750);
  const entry = useIntersectionObserver(ref, { threshold: 0.5 });
  const queryClient = useQueryClient();
  const matches = useMediaQuery("(min-width: 1024px)");
  const isVisible = !!entry?.isIntersecting;

  const sendReq = async ({ pageParam = 0 }) => {
    const params = new URLSearchParams([]);
    params.append("page", pageParam.toString());
    params.append("limit", limit.toString());

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
  };

  const { data, error, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["orders", debounceFilter, debounceSort, endDate, filterProp],
      queryFn: sendReq,
      initialPageParam: 1,
      getNextPageParam: (lastPage, _allPages, lastPageParam) => {
        if (lastPage.totalRows > lastPageParam * limit)
          return lastPage.nextPage;
        else return undefined;
      },
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    if (!isVisible || isFetching || !hasNextPage) return () => {};

    const interval = setInterval(() => {
      if (isVisible) {
        fetchNextPage();
      }
    }, 250);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const handleSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const values = value.split("/");
    await queryClient.invalidateQueries({ queryKey: ["orders"] });
    setSortBy({ orderBy: values[0], direction: values[1] });
  };

  const handleFilterInput = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    await queryClient.invalidateQueries({
      queryKey: ["orders"],
    });
    setFilterBy(value);
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

  return (
    <div className="px-4 flex flex-col items-center">
      <div
        className={`sticky top-0 ${
          isFiltersShown ? "lg:h-[150px]" : "lg:h-[60px]"
        } z-40 flex flex-col bg-background-0 items-center justify-center p-4 w-full`}
      >
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
                  onChange={async (update: [Date, Date]) => {
                    await queryClient.invalidateQueries({
                      queryKey: ["orders"],
                    });
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
                  onChange={handleFilterInput}
                />
              </div>
            </form>
          </>
        ) : (
          <span
            onClick={() => setIsFiltersShown(true)}
            className="flex gap-2 hover:cursor-pointer"
          >
            <p>Сортировка и поиск</p>
            <ChevronDownIcon className="w-6 h-6" />
          </span>
        )}
      </div>
      {status === "pending" ? (
        <LoadingSpinner />
      ) : status === "error" ? (
        <p className="text-center">Error: {error.message}</p>
      ) : (
        <>
          <div
            className={`hidden lg:grid max-w-screen-xl sticky ${
              isFiltersShown ? "top-[150px]" : "top-[60px]"
            } bg-background-700 border-2 border-background-700 text-text-800 gap-x-2 gap-y-1 vsm:gap-x-[2px] grid-cols-1 vsm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,500px))_minmax(5rem,9rem)] items-center`}
          >
            <span className="bg-background-300 h-full py-2 px-4">
              Номер заказа и дата
            </span>
            <span className="bg-background-300 h-full py-2 px-4">
              Имя заказчика
            </span>
            <span className="bg-background-300 h-full py-2 px-4">Телефон</span>
            <span className="bg-background-300 h-full py-2 px-4">
              Сумма заказа
            </span>
            <span className="bg-background-300 h-full py-2 px-4">
              Детали заказа
            </span>
          </div>
          <ul className="bg-background-200 border-t-2 lg:border-t-0 border-r-2 border-l-2 border-b-2 border-background-700 max-w-screen-xl divide-y-2 divide-solid divide-background-700">
            {data &&
              data.pages.map((group, i) => (
                <Fragment key={i}>
                  {group.orders.map((item: Order) => (
                    <li
                      className="lg:bg-background-700 text-text-800 p-2 vsm:p-4 lg:p-0 grid gap-x-2 gap-y-1 vsm:gap-x-6 lg:gap-x-[2px] grid-cols-1 vsm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,500px))_minmax(5rem,9rem)] items-center"
                      key={item.orderId}
                    >
                      <div className="bg-background-200 lg:py-2 lg:px-4 grid vsm:gap-x-6 grid-cols-subgrid vsm:col-span-2 vsm:grid-cols-2 lg:col-span-1 lg:block">
                        <p className="font-bold text-center vsm:text-start">
                          Заказ №{item.orderId}
                        </p>
                        <p className="text-center vsm:text-start text-xs vsm:text-base">
                          от <FormatDate createdAt={item.createdAt} />
                        </p>
                      </div>
                      <p className="bg-background-200 lg:py-2 lg:px-4 h-full mt-2 vsm:mt-0 flex flex-col justify-center">
                        {!matches && "Имя заказчика: "}
                        {item.customerName}
                      </p>
                      <p className="bg-background-200 lg:py-2 lg:px-4 h-full flex flex-col justify-center">
                        {!matches && "Тел.: "}
                        {item.customerPhone}
                      </p>
                      <div className="bg-background-200 lg:py-2 lg:px-4 h-full flex flex-col justify-center">
                        <p className="rounded-xl px-4 py-1 text-start bg-accent-100 text-text-700 font-medium w-fit mt-2 lg:mt-0">
                          {!matches && "Сумма заказа: "}
                          {item.orderDetails.totalPrice}&nbsp;руб.
                        </p>
                      </div>
                      <Link
                        className="bg-background-200 lg:py-2 lg:px-4 h-full text-text-600 hover:text-accent-800 font-bold underline text-end lg:text-center flex flex-col justify-end lg:justify-center"
                        to={`/orders/${item.orderId}`}
                      >
                        подробнее...
                      </Link>
                    </li>
                  ))}
                </Fragment>
              ))}
          </ul>
        </>
      )}
      <div className="h-4 w-full" ref={ref} />
    </div>
  );
};

export default OrdersList;
