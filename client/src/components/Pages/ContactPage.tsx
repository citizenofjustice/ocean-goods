import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../UI/table";
import { AxiosError } from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ErrorPage from "./ErrorPage";
import LoadingSpinner from "../UI/LoadingSpinner";
import { Fragment, useState } from "react";
import { Order } from "../../types/Order";
import FormatDate from "../FormatDate";
import { Input } from "../UI/input";
import { FilterOrdersProp } from "../OrdersList";
import { useDebounce, useMediaQuery } from "usehooks-ts";
import SimpleSelect, { SelectOptions } from "../UI/SimpleSelect";
import { Link } from "react-router-dom";
import { ArrowUpDownIcon } from "lucide-react";
import { SortBy } from "../../types/SortBy";
import { DatePickerWithRange } from "../UI/DatePickerWithRange";

const filterSelectOptions: SelectOptions[] = [
  {
    value: "orderId",
    content: "по номеру",
  },
  {
    value: "customerName",
    content: "по имени",
  },
];

// Initial values for sorting
const initSortValues: SortBy = {
  orderBy: "",
  direction: "asc",
};

const ContactPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const [filterProp, setFilterProp] = useState<FilterOrdersProp>({
    fieldName: "orderId",
  });
  const [filterBy, setFilterBy] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("orderId");
  const debounceFilter = useDebounce(filterBy, 750);
  const [sortBy, setSortBy] = useState(initSortValues);
  const isSmall = useMediaQuery("(max-width: 320px)");
  const limit = 10;

  // Function to send request
  const sendReq = async (/*{ pageParam = 0 }*/) => {
    const params = new URLSearchParams([]);
    // params.append("page", pageParam.toString());
    params.append("limit", limit.toString());

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
      queryKey: ["orders", debounceFilter, sortBy],
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

  // Handler for filter input change
  const handleFilterInput = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setFilterBy(value);
  };

  // Handler for select change
  const handleSelect = async (value: string) => {
    if (value === "orderId" || value === "customerName") {
      setFilterProp({ fieldName: value });
    }
    setSelectedOption(value);
  };

  return (
    <>
      <div className="fixed w-full px-2">
        <div className="max-w-4xl sticky top-0 m-auto pt-4 mb-4 flex justify-start gap-2 flex bg-red">
          {/* <OrdersFilter
                filterProp={filterProp}
                handleCheckboxChange={handleCheckboxChange}
                filterBy={filterBy}
                handleFilterInput={handleFilterInput}
              /> */}
          <Input
            placeholder="Поиск ..."
            value={filterBy}
            onChange={handleFilterInput}
            className="max-w-[260px]"
          />
          <SimpleSelect
            options={filterSelectOptions}
            selectedOption={selectedOption}
            onOptionSelect={handleSelect}
            size={isSmall ? "small" : "normal"}
          />
          <DatePickerWithRange />
        </div>
        {status === "pending" ? (
          <LoadingSpinner />
        ) : status === "error" ? (
          <ErrorPage
            error={error}
            customMessage="При загрузке списка заказов произошла ошибка"
          />
        ) : (
          <div className="max-w-4xl m-auto flex max-h-[80vh] rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="sticky top-0 bg-white drop-shadow-[0_0px_3px_rgba(0,0,0,0.25)]">
                <TableRow>
                  <TableHead className="w-[150px]">
                    <span
                      className="flex items-center shrink-0"
                      onClick={() =>
                        setSortBy({
                          orderBy: "orderId",
                          direction:
                            sortBy.direction === "asc" ? "desc" : "asc",
                        })
                      }
                    >
                      Номер заказа
                      <ArrowUpDownIcon className="ml-2 h-4 w-4 min-w-4 min-h-4" />
                    </span>
                  </TableHead>
                  <TableHead className="w-[140px]">
                    <span
                      className="flex items-center shrink-0"
                      onClick={() =>
                        setSortBy({
                          orderBy: "createdAt",
                          direction:
                            sortBy.direction === "asc" ? "desc" : "asc",
                        })
                      }
                    >
                      Дата заказа
                      <ArrowUpDownIcon className="ml-2 h-4 w-4 min-w-4 min-h-4" />
                    </span>
                  </TableHead>
                  <TableHead>
                    <span
                      className="flex items-center shrink-0"
                      onClick={() =>
                        setSortBy({
                          orderBy: "customerName",
                          direction:
                            sortBy.direction === "asc" ? "desc" : "asc",
                        })
                      }
                    >
                      Имя заказчика
                      <ArrowUpDownIcon className="ml-2 h-4 w-4 min-w-4 min-h-4" />
                    </span>
                  </TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead className="text-right">
                    <span
                      className="flex items-center shrink-0"
                      onClick={() =>
                        setSortBy({
                          orderBy: "totalPrice",
                          direction:
                            sortBy.direction === "asc" ? "desc" : "asc",
                        })
                      }
                    >
                      Сумма заказа
                      <ArrowUpDownIcon className="ml-2 h-4 w-4 min-w-4 min-h-4" />
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="max-h-[70vh] overflow-auto">
                {data.pages.map((group, i) => (
                  <Fragment key={i}>
                    {group.orders.map((item: Order) => (
                      <TableRow key={item.orderId}>
                        <TableCell className="font-medium">
                          <Link to={`/orders/${item.orderId}`}>
                            Заказ №{item.orderId}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <FormatDate createdAt={item.createdAt} />
                        </TableCell>
                        <TableCell>{item.customerName}</TableCell>
                        <TableCell>{item.customerPhone}</TableCell>
                        <TableCell className="text-right">
                          {item.totalOrderPrice}&nbsp;руб.
                        </TableCell>
                      </TableRow>
                    ))}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
};

export default ContactPage;
