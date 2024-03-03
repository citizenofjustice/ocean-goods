import { format } from "date-fns";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Column, ColumnDef } from "@tanstack/react-table";

import ErrorPage from "./ErrorPage";
import { DataTable } from "../ui/DataTable";
import { OrderItem } from "../../types/OrderItem";
import { CatalogItem } from "../../types/CatalogItem";
import { ProductType } from "../../types/ProductType";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { SortArrowsIcons } from "../ui/SortArrowsIcons";
import { TableCell, TableRow } from "../ui/table";

interface CatalogItemWithType extends CatalogItem {
  productTypes: ProductType;
}

interface OrderItemWithTypeName extends OrderItem {
  type: string;
  finalPrice: number;
  catalogItem?: CatalogItemWithType;
}

const TableHeadSort: React.FC<{
  column: Column<OrderItemWithTypeName, unknown>;
  children: string;
}> = ({ column, children }) => {
  return (
    <>
      <span
        className={`${
          column.getIsSorted() ? "text-black" : ""
        } flex items-center shrink-0 hover:cursor-pointer`}
        role="button"
        tabIndex={0}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {children}
        <SortArrowsIcons
          isActive={column.getIsSorted() ? true : false}
          sortDirection={column.getIsSorted() === "asc" ? "asc" : "desc"}
        />
      </span>
    </>
  );
};

const columns: ColumnDef<OrderItemWithTypeName>[] = [
  {
    accessorKey: "itemSnapshot.mainImage",
    cell: (tableProps) => (
      <div className="overflow-hidden min-w-[40px] max-w-[100px] rounded-md">
        <Link to={`/item/${tableProps.row.original.productId}`}>
          <img src={tableProps.row.original.itemSnapshot.mainImage} />
        </Link>
      </div>
    ),
    header: "Фото",
  },
  {
    accessorKey: "itemSnapshot.productName",
    cell: (tableProps) => (
      <Link to={`/item/${tableProps.row.original.productId}`}>
        {tableProps.row.original.itemSnapshot.productName}
      </Link>
    ),
    header: ({ column }) => {
      return <TableHeadSort column={column}>Наименование</TableHeadSort>;
    },
  },
  {
    accessorKey: "catalogItem.productTypes.type",
    header: ({ column }) => {
      return <TableHeadSort column={column}>Тип продукта</TableHeadSort>;
    },
  },
  {
    accessorKey: "amount",
    cell: (tableProps) => (
      <p className="text-center pr-4">{tableProps.row.original.amount}</p>
    ),
    header: ({ column }) => {
      return <TableHeadSort column={column}>Кол.-во</TableHeadSort>;
    },
  },
  {
    accessorKey: "finalPrice",
    cell: (tableProps) => (
      <p className="text-end pr-4">
        {tableProps.row.original.finalPrice}&nbsp;руб.
      </p>
    ),
    header: ({ column }) => {
      return <TableHeadSort column={column}>Цена (за шт.)</TableHeadSort>;
    },
  },
];

const OrderPage = () => {
  const params = useParams();
  const axiosPrivate = useAxiosPrivate();
  const { id } = params;

  const { isLoading, isError, error, data } = useQuery({
    queryKey: [`order`, id],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/orders/${id}`);
      if (response instanceof AxiosError) {
        throw new Error("Error while fetching orders");
      } else {
        const fetchedOrderItems = response.data.orderItems.map(
          (item: OrderItem) => {
            const finalPrice =
              item.itemSnapshot.price -
              Math.round(
                item.itemSnapshot.price * (item.itemSnapshot.discount / 100)
              );
            return { ...item, finalPrice };
          }
        );
        return { ...response.data, orderItems: fetchedOrderItems };
      }
    },
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <div className="w-full px-4 pb-4">
        <div className="mt-6">
          {isLoading && <Loader2 className="m-auto h-8 w-8 animate-spin" />}
          {!isLoading && !isError && (
            <>
              <div className="mb-4 font-body text-base flex flex-col items-center justify-center sm:flex-row sm:divide-x sm:divide-solid sm:divide-background-700">
                <p className="sm:px-4">
                  Дата заказа:{" "}
                  {format(new Date(data.createdAt), "dd.MM.y HH:mm")}
                </p>
                <p className="sm:px-4">Заказчик: {data.customerName}</p>
                <p className="sm:px-4">Телефон: {data.customerPhone}</p>
              </div>
              <DataTable
                columns={columns}
                data={data.orderItems}
                footer={
                  <TableRow>
                    <TableCell colSpan={3}>Общая сумма заказа:</TableCell>
                    <TableCell colSpan={2} className="text-end">
                      {data.totalOrderPrice}&nbsp;руб.
                    </TableCell>
                  </TableRow>
                }
              />
            </>
          )}
          {isError && (
            <>
              <ErrorPage
                error={error}
                customMessage="При загрузке заказа произошел сбой"
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderPage;
