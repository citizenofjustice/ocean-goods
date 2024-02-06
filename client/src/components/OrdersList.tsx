import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Order } from "../types/Order";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDebounce, useIntersectionObserver } from "usehooks-ts";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "./UI/LoadingSpinner";
import { SelectOptions } from "./UI/SimpleSelect";
import OrdersListItem from "./OrdersListItem";
import SortComponent from "./SortComponent";
import InputDateRange from "./UI/InputDateRange";
import OrdersFilter from "./OrdersFilter";

interface SortBy {
  orderBy: string;
  direction: string;
}

const initSortValues: SortBy = {
  orderBy: "",
  direction: "",
};

export interface FilterProp {
  fieldName: "id" | "customer_name";
}

const sortOptions: SelectOptions[] = [
  {
    value: "created_at/DESC",
    content: "по дате (убыв.)",
  },
  { value: "created_at/ASC", content: "по дате (возр.)" },
  {
    value: "customer_name/DESC",
    content: "по имени (убыв.)",
  },
  {
    value: "customer_name/ASC",
    content: "по имени (возр.)",
  },
  {
    value: "totalPrice/DESC",
    content: "по цене (убыв.)",
  },
  { value: "totalPrice/ASC", content: "по цене (возр.)" },
];

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
  const [selectedOption, setSelectedOption] = useState<string>("");
  const limit = 10;
  const ref = useRef<HTMLDivElement>(null);
  const debounceFilter = useDebounce(filterBy, 750);
  const entry = useIntersectionObserver(ref, { threshold: 0.5 });
  const queryClient = useQueryClient();
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
    if (sortBy.orderBy && sortBy.direction) {
      params.append("orderBy", sortBy.orderBy);
      params.append("direction", sortBy.direction);
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
      queryKey: ["orders", debounceFilter, sortBy, endDate, filterProp],
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

  const handleSelect = async (value: string) => {
    setSelectedOption(value);
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
        typeof Number(filterBy) === "number" && setFilterBy("");
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
        } z-40 flex flex-col bg-background-0 items-center justify-center p-4 w-full text-text-800`}
      >
        {isFiltersShown ? (
          <>
            <div className="mb-4 rounded-full p-2 bg-primary-200">
              <ChevronUpIcon
                onClick={() => setIsFiltersShown(false)}
                className="w-6 h-6 hover:cursor-pointer"
              />
            </div>
            <form className="mb-4 flex lg:flex-row flex-col lg:gap-8 gap-4 mx-4 sm:w-4/5 sm:justify-center">
              <SortComponent
                sortOptions={sortOptions}
                selectedOption={selectedOption}
                handleSelect={handleSelect}
              />
              <InputDateRange
                startDate={startDate}
                endDate={endDate}
                setDateRange={async (update: [Date, Date]) => {
                  await queryClient.invalidateQueries({
                    queryKey: ["orders"],
                  });
                  setDateRange(update);
                }}
              />
              <OrdersFilter
                filterProp={filterProp}
                handleCheckboxChange={handleCheckboxChange}
                filterBy={filterBy}
                handleFilterInput={handleFilterInput}
              />
            </form>
          </>
        ) : (
          <span
            onClick={() => setIsFiltersShown(true)}
            className="mb-4 flex gap-2 hover:cursor-pointer rounded-full p-2 bg-primary-200"
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
          {data.pages[0].totalRows > 0 && (
            <ul className="bg-background-50 border-t-2 lg:border-t-0 border-r-2 border-l-2 border-b-2 border-background-700 max-w-screen-xl divide-y-2 divide-solid divide-background-700">
              {data.pages.map((group, i) => (
                <Fragment key={i}>
                  {group.orders.map((item: Order) => (
                    <OrdersListItem key={item.orderId} order={item} />
                  ))}
                </Fragment>
              ))}
            </ul>
          )}
        </>
      )}
      <div className="h-4 w-full" ref={ref} />
    </div>
  );
};

export default OrdersList;
