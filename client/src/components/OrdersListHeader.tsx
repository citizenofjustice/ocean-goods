const OrdersListHeader: React.FC<{ isFiltersShown: boolean }> = ({
  isFiltersShown,
}) => {
  return (
    <div
      className={`hidden lg:block sticky max-w-screen-xl bg-background-0 ${
        isFiltersShown ? "top-[155px]" : "top-[65px]"
      }
      text-text-800  items-center`}
    >
      <div
        className={`text-text-50 font-medium rounded-t-xl w-full pt-4 pr-4 pl-4 bg-background-200 grid gap-x-2 gap-y-1 vsm:gap-x-1 grid-cols-1 vsm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,500px))_minmax(5rem,9rem)]`}
      >
        <span className="bg-background-700 rounded h-full py-2 px-4">
          Номер заказа и дата
        </span>
        <span className="bg-background-700 rounded h-full py-2 px-4">
          Имя заказчика
        </span>
        <span className="bg-background-700 rounded h-full py-2 px-4">
          Телефон
        </span>
        <span className="bg-background-700 rounded h-full py-2 px-4">
          Сумма заказа
        </span>
        <span className="bg-background-700 rounded h-full py-2 px-4">
          Детали заказа
        </span>
      </div>
    </div>
  );
};

export default OrdersListHeader;
