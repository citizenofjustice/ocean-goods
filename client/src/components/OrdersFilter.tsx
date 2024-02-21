import { FilterOrdersProp } from "./OrdersList";

const inputStyles = `focus:outline-none focus:border-accent-700 focus:ring-1 focus:ring-accent-700 hover:border-accent-700
disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-background-50 disabled:text-text-500 disabled:border-background-200 disabled:shadow-none
invalid:border-red-500 invalid:text-text-600 focus:invalid:border-red-500 focus:invalid:ring-red-500`;

const OrdersFilter: React.FC<{
  filterProp: FilterOrdersProp;
  handleCheckboxChange: () => void;
  filterBy: string;
  handleFilterInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ filterProp, handleCheckboxChange, filterBy, handleFilterInput }) => {
  return (
    <div className="flex sm:flex-row flex-col gap-2 items-center sm:items-end">
      <label
        className="basis-1/2 vsm:basis-2/5 lg:basis-1/2 flex flex-col vsm:flex-row sm:flex-col gap-2 vsm:items-end sm:items-start"
        htmlFor="order-filter"
      >
        <div>Фильтрация по:</div>
        <div className="flex flex-col">
          <div>
            <input
              id="order-filter-id"
              type="checkbox"
              checked={filterProp.fieldName === "id"}
              onChange={handleCheckboxChange}
              className="w-fit col-span-1 accent-primary-600 mr-2"
            />
            <label htmlFor="order-filter-id" className="col-span-5">
              по номеру заказа
            </label>
          </div>
          <div>
            <input
              id="order-filter-customer"
              type="checkbox"
              checked={filterProp.fieldName === "customer_name"}
              onChange={handleCheckboxChange}
              className="w-fit col-span-1 accent-primary-600 mr-2"
            />
            <label htmlFor="order-filter-customer" className="col-span-5">
              по имени заказчика
            </label>
          </div>
        </div>
      </label>
      <input
        id="order-filter"
        name="filter"
        type={filterProp.fieldName === "id" ? "number" : "text"}
        className={`${inputStyles} appearance-none text-text-700 py-3 px-4 rounded leading-tight truncate basis-1/2 vsm:basis-3/5 lg:basis-1/2 h-fit border border-gray-300 block sm:min-w-[120px] p-2.5`}
        placeholder="Введите искомое значение"
        value={filterBy}
        onChange={handleFilterInput}
      />
    </div>
  );
};

export default OrdersFilter;
