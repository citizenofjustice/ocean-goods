import { AxiosError } from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDebounce, useIntersectionObserver } from "usehooks-ts";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

import { Order } from "../types/Order";
import ErrorPage from "./Pages/ErrorPage";
import OrdersFilter from "./OrdersFilter";
import SortComponent from "./SortComponent";
import OrdersListItem from "./OrdersListItem";
import LoadingSpinner from "./UI/LoadingSpinner";
import InputDateRange from "./UI/InputDateRange";
import OrdersListHeader from "./OrdersListHeader";
import { SelectOptions } from "./UI/SimpleSelect";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

// Interface for sorting
interface SortBy {
  orderBy: string;
  direction: string;
}

// Initial values for sorting
const initSortValues: SortBy = {
  orderBy: "",
  direction: "",
};

// interface for filtering
export interface FilterProp {
  fieldName: "id" | "customer_name";
}

// Options for sorting
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
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const ref = useRef<HTMLDivElement>(null);
  const [isFiltersShown, setIsFiltersShown] = useState<boolean>(false);
  const [filterProp, setFilterProp] = useState<FilterProp>({
    fieldName: "id",
  });
  const [filterBy, setFilterBy] = useState<string>("");
  const [dateRange, setDateRange] = useState<Date[] | null[]>([null, null]);
  const [startDate, endDate] = dateRange;
  const debounceFilter = useDebounce(filterBy, 750);
  const [sortBy, setSortBy] = useState(initSortValues);
  const [selectedOption, setSelectedOption] = useState<string>("");

  // IntersectionObserver for inifinite page loading
  const entry = useIntersectionObserver(ref, { threshold: 0.5 });
  const isVisible = !!entry?.isIntersecting;

  const limit = 10;

  // Function to send request
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
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.error.message);
      } else throw new Error("Во время загрузки произошла неизвестная ошибка");
    }
  };

  // Infinite query hook
  const { data, error, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["orders", debounceFilter, sortBy, endDate, filterProp],
      queryFn: sendReq,
      initialPageParam: 1,
      getNextPageParam: (lastPage, _allPages, lastPageParam) => {
        // if total count of records more than already loaded records count
        // then return incremented next page value
        if (lastPage.totalRows > lastPageParam * limit)
          return lastPage.nextPage;
        else return undefined;
      },
      refetchOnWindowFocus: false,
    });

  // Effect hook to fetch next page when visible
  useEffect(() => {
    // do nothing while ref is not visible, request is fetching or no pages left
    if (!isVisible || isFetching || !hasNextPage) return () => {};

    const interval = setInterval(() => {
      if (isVisible) {
        fetchNextPage();
      }
    }, 250);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  // Handler for select change
  const handleSelect = async (value: string) => {
    setSelectedOption(value);
    const values = value.split("/");
    await queryClient.invalidateQueries({ queryKey: ["orders"] });
    setSortBy({ orderBy: values[0], direction: values[1] });
  };

  // Handler for filter input change
  const handleFilterInput = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setFilterBy(value);
  };

  // Handler for checkbox change
  const handleCheckboxChange = () => {
    switch (filterProp.fieldName) {
      case "id": {
        setFilterProp({ fieldName: "customer_name" });
        break;
      }
      case "customer_name": {
        setFilterProp({ fieldName: "id" });
        // if after checkbox change input type is number clear filter field
        typeof Number(filterBy) === "number" && setFilterBy("");
        break;
      }
      default: {
        setFilterProp({ fieldName: "id" });
        break;
      }
    }
  };

  const handleDateRangeSelect = async (update: [Date, Date]) => {
    if (update[0] && update[1]) {
      const endDateIncluded = new Date(
        new Date(update[1].getTime()).setHours(23, 59, 59, 999)
      );
      await queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      setDateRange([update[0], endDateIncluded]);
      return;
    }
    setDateRange(update);
  };

  return (
    <>
      <div
        className={`sticky top-0 ${
          isFiltersShown ? "lg:h-[155px]" : "lg:h-[65px]"
        } z-40 flex flex-col bg-background-0 items-center justify-center pt-4 mb-4 w-full text-text-800`}
      >
        {isFiltersShown ? (
          <>
            <div className="mb-4 rounded-full p-2 border-2 bg-primary-100 border-accent-700">
              <ChevronUpIcon
                onClick={() => setIsFiltersShown(false)}
                className="w-6 h-6 hover:cursor-pointer"
              />
            </div>
            <form className="mb-4 flex lg:flex-row flex-col lg:gap-8 gap-4 mx-4 vsm:w-4/5 sm:justify-center">
              <SortComponent
                sortOptions={sortOptions}
                selectedOption={selectedOption}
                handleSelect={handleSelect}
              />
              <InputDateRange
                startDate={startDate}
                endDate={endDate}
                setDateRange={(update: [Date, Date]) =>
                  handleDateRangeSelect(update)
                }
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
            className="mb-4 flex gap-2 hover:cursor-pointer rounded-full p-2 border-2 bg-primary-100 border-accent-700 text-text-800 font-medium"
          >
            <p>Сортировка и поиск</p>
            <ChevronDownIcon className="w-6 h-6" />
          </span>
        )}
      </div>
      <div className="px-4 flex flex-col items-center">
        {status === "pending" ? (
          <LoadingSpinner />
        ) : status === "error" ? (
          <ErrorPage
            error={error}
            customMessage="При загрузке списка заказов произошла ошибка"
          />
        ) : (
          <div className="bg-background-200 p-4 lg:p-0 lg:pb-4 rounded-xl">
            <OrdersListHeader isFiltersShown={isFiltersShown} />
            {data.pages[0].totalRows > 0 ? (
              <ul className="lg:mt-1 flex flex-col gap-y-4 lg:gap-y-1 max-w-screen-xl">
                {data.pages.map((group, i) => (
                  <Fragment key={i}>
                    {group.orders.map((item: Order) => (
                      <OrdersListItem key={item.orderId} order={item} />
                    ))}
                  </Fragment>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center">
                {filterBy || endDate
                  ? "Заказы c указанными параметрами не обнаружены"
                  : "Заказы не обнаружены"}
              </div>
            )}
          </div>
        )}
        <div className="h-8 w-full" ref={ref} />
      </div>
    </>
  );
};

export default OrdersList;
