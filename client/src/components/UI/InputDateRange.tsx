import ReactDatePicker, { registerLocale } from "react-datepicker";
registerLocale("ru", ru);
import ru from "date-fns/locale/ru";
import "react-datepicker/dist/react-datepicker.css";

const inputStyles = `focus:outline-none focus:border-accent-700 focus:ring-1 focus:ring-accent-700 hover:border-accent-700
  disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-background-50 disabled:text-text-500 disabled:border-background-200 disabled:shadow-none
  invalid:border-red-500 invalid:text-text-600 focus:invalid:border-red-500 focus:invalid:ring-red-500`;

const InputDateRange: React.FC<{
  startDate: Date | null;
  endDate: Date | null;
  setDateRange: (date: [Date, Date]) => void;
}> = ({ startDate, endDate, setDateRange }) => {
  return (
    <div className="flex lg:flex-col vsm:flex-row flex-col gap-2 items-center">
      <label
        className="basis-1/2 vsm:basis-2/5 lg:basis-1/2"
        htmlFor="order-datepicker"
      >
        Фильтр по дате:
      </label>
      <div className="datepicker-w-full basis-1/2 vsm:basis-3/5 lg:basis-1/2">
        <ReactDatePicker
          id="order-datepicker"
          className={`${inputStyles} appearance-none text-text-700 py-3 px-4 pr-8 rounded leading-tight truncate border border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full`}
          locale={ru}
          dateFormat="dd/MM/yyyy"
          placeholderText="Укажите временной период"
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          maxDate={new Date()}
          onChange={setDateRange}
          autoComplete="false"
          isClearable={true}
        />
      </div>
    </div>
  );
};

export default InputDateRange;
