import { useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import { useDebounce } from "usehooks-ts";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { DateRange } from "react-day-picker";
import { SortBy } from "src/types/SortBy";

const LIMIT = 20;

const initSortValues: SortBy = {
  orderBy: "",
  direction: "asc",
};

export function useOrders() {
  const axiosPrivate = useAxiosPrivate();
  const [filterProp, setFilterProp] = useState({ fieldName: "orderId" });
  const [filterBy, setFilterBy] = useState("");
  const debounceFilter = useDebounce(filterBy, 750);
  const [sortBy, setSortBy] = useState(initSortValues);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Function to send request
  const sendReq = async ({ pageParam = 0 }) => {
    const params = new URLSearchParams([]);
    params.append("page", pageParam.toString());
    params.append("limit", LIMIT.toString());

    // Add parameters to the URL search parameters if they exist
    if (dateRange && dateRange.from && dateRange.to) {
      params.append("startDate", dateRange.from.toISOString());
      params.append("endDate", dateRange.to.toISOString());
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
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    status,
    fetchStatus,
  } = useInfiniteQuery({
    queryKey: ["orders", debounceFilter, sortBy, dateRange],
    queryFn: sendReq,
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      // if total count of records more than already loaded records count
      // then return incremented next page value
      if (lastPage.totalRows > lastPageParam * LIMIT) return lastPage.nextPage;
      else return undefined;
    },
    refetchOnWindowFocus: false,
  });

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    status,
    fetchStatus,
    setFilterProp,
    filterBy,
    setFilterBy,
    sortBy,
    setSortBy,
    dateRange,
    setDateRange,
  };
}
