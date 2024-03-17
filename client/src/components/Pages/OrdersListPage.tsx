import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/shadcn/table";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { Input } from "@/components/UI/shadcn/input";
import { Fragment, useEffect, useRef, useState } from "react";
import { useIntersectionObserver, useMediaQuery } from "usehooks-ts";

import { Order } from "@/types/Order";
import { useOrders } from "@/hooks/useOrders";
import ErrorPage from "@/components/Pages/ErrorPage";
import { TableColumnHeader } from "@/types/TableColumnHeader";
import { SortArrowsIcons } from "@/components/UI/SortArrowsIcons";
import { DatePickerWithRange } from "@/components/UI/DatePickerWithRange";
import SimpleSelect, { SelectOptions } from "@/components/UI/SimpleSelect";

const FILTER_SELECT_OPTIONS: SelectOptions[] = [
  { value: "orderId", content: "по номеру" },
  { value: "customerName", content: "по имени" },
];

const OrdersListPage = () => {
  const {
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
  } = useOrders();
  const [selectedOption, setSelectedOption] = useState<string>("orderId");
  const [filterPlaceholder, setFilterPlaceholder] =
    useState<string>("по номеру");
  const isSmall = useMediaQuery("(max-width: 320px)");

  // IntersectionObserver for inifinite page loading
  const intersectionRef = useRef<HTMLTableRowElement>(null);
  const entry = useIntersectionObserver(intersectionRef, { threshold: 0.5 });
  const isVisible = !!entry?.isIntersecting;

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
  }, [isVisible, isFetching]);

  // Handler for filter input change
  const handleFilterInput = async (
    event: React.ChangeEvent<HTMLInputElement>,
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
    const option = FILTER_SELECT_OPTIONS.find((item) => value === item.value);
    if (option) setFilterPlaceholder(option.content);
  };

  const handleDatepickerChange = (date: DateRange | undefined) => {
    if (date?.to) {
      setDateRange(date);
    }
  };

  const tableHeads: TableColumnHeader[] = [
    { name: "Номер заказа", orderBy: "orderId", className: "w-[150px]" },
    { name: "Дата заказа", orderBy: "createdAt", className: "w-[140px]" },
    { name: "Имя заказчика", orderBy: "customerName" },
    { name: "Телефон", orderBy: undefined },
    { name: "Сумма заказа", orderBy: "totalPrice", textAlign: "justify-end" },
  ];

  const handleSort = (item: TableColumnHeader) => {
    if (item.orderBy) {
      setSortBy({
        orderBy: item.orderBy,
        direction: sortBy.direction === "asc" ? "desc" : "asc",
      });
    }
  };

  return (
    <>
      <div className="w-full px-4 pb-4">
        <div className="m-auto mb-4 grid max-w-4xl grid-cols-1 justify-between gap-2 pt-4 sm:grid-cols-12">
          <div className="flex gap-2 sm:col-span-7">
            <Input
              placeholder={`Поиск ${filterPlaceholder}`}
              value={filterBy}
              onChange={handleFilterInput}
              className="max-w-[260px]"
            />
            <SimpleSelect
              options={FILTER_SELECT_OPTIONS}
              selectedOption={selectedOption}
              onOptionSelect={handleSelect}
              size={isSmall ? "small" : "normal"}
            />
          </div>
          <div className="sm:col-span-5 sm:ml-auto">
            <DatePickerWithRange onDateChange={handleDatepickerChange} />
          </div>
        </div>
        <div className="m-auto flex max-h-[70vh] max-w-4xl overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-white drop-shadow-[0_0px_3px_rgba(0,0,0,0.25)]">
              <TableRow>
                {tableHeads.map((item, i) => (
                  <TableHead
                    key={i}
                    className={`${
                      sortBy.orderBy === item.orderBy ? "text-black" : ""
                    } ${item.className}`}
                  >
                    {item.orderBy ? (
                      <span
                        className={`flex shrink-0 items-center hover:cursor-pointer ${item.textAlign}`}
                        onClick={() => handleSort(item)}
                      >
                        {item.name}
                        <SortArrowsIcons
                          isActive={sortBy.orderBy === item.orderBy}
                          sortDirection={sortBy.direction}
                        />
                      </span>
                    ) : (
                      <>{item.name}</>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-auto">
              {status === "pending" ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : status === "error" ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <ErrorPage
                      error={error}
                      customMessage="При загрузке списка заказов произошла ошибка"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {data &&
                    data.pages.map((group, i) => (
                      <Fragment key={i}>
                        {group.orders.map((item: Order) => (
                          <TableRow key={item.orderId}>
                            <TableCell className="font-medium">
                              <Link to={`/orders/${item.orderId}`}>
                                Заказ №{item.orderId}
                              </Link>
                            </TableCell>
                            <TableCell>
                              {format(
                                new Date(item.createdAt),
                                "dd.MM.y HH:mm",
                              )}
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
                  {data && data.pages[0].orders.length === 0 ? (
                    <TableRow>
                      <TableCell className="text-center" colSpan={5}>
                        {filterBy || dateRange
                          ? "Заказы c указанными параметрами не обнаружены"
                          : "Заказы не обнаружены"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {status === "success" && fetchStatus === "fetching" && (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <div className="flex justify-center">
                              <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )}
                </>
              )}
              <TableRow ref={intersectionRef} className="h-1 w-full"></TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default OrdersListPage;
