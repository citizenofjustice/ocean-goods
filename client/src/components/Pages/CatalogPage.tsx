import { AxiosError } from "axios";
import { observer } from "mobx-react-lite";
import { Input } from "@/components/UI/shadcn/input";
import { ChevronDownCircle, Search } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDebounce, useIntersectionObserver } from "usehooks-ts";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import axios from "@/api/axios";
import { SortBy } from "@/types/SortBy";
import { CatalogItem } from "@/types/CatalogItem";
import ErrorPage from "@/components/Pages/ErrorPage";
import CatalogItemModel from "@/classes/CatalogItemModel";
import CatalogItemCard from "@/components/CatalogItemCard";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import SimpleSelect, { SelectOptions } from "@/components/UI/SimpleSelect";

// Initial values for sorting
const initSortValues: SortBy = {
  orderBy: "productName",
  direction: "asc",
};

interface SortSelectOption extends SelectOptions {
  dbField: string;
  direction: "asc" | "desc";
}

// Options for sorting
const sortOptions: SortSelectOption[] = [
  {
    value: "productNameUp",
    dbField: "productName",
    content: "по названию (возр.)",
    direction: "asc",
  },
  {
    value: "productNameDown",
    dbField: "productName",
    content: "по названию (убыв.)",
    direction: "desc",
  },
  {
    value: "createdAtUp",
    dbField: "createdAt",
    content: "по дате (возр.)",
    direction: "asc",
  },
  {
    value: "createdAtDown",
    dbField: "createdAt",
    content: "по дате (убыв.)",
    direction: "desc",
  },
  {
    value: "finalPriceUp",
    dbField: "finalPrice",
    content: "по цене (возр.)",
    direction: "asc",
  },
  {
    value: "finalPriceDown",
    dbField: "finalPrice",
    content: "по цене (убыв.)",
    direction: "desc",
  },
];

/**
 * Component for rendering Catalog page dividided into grid
 * @returns
 */
const CatalogPage = observer(() => {
  const ref = useRef<HTMLDivElement>(null);
  const [filterBy, setFilterBy] = useState<string>("");
  const debounceFilter = useDebounce(filterBy, 750);
  const [sortBy, setSortBy] = useState(initSortValues);
  const [isFiltersShown, setIsFiltersShown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("createdAtDown");
  const queryClient = useQueryClient();
  const filtersRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for inifinite page loading
  const entry = useIntersectionObserver(ref, { threshold: 0.5 });
  const isVisible = !!entry?.isIntersecting;

  const limit = 25;

  // Function to send request
  const sendReq = async ({ pageParam = 0 }) => {
    const params = new URLSearchParams([]);
    params.append("page", pageParam.toString());
    params.append("limit", limit.toString());

    // Add parameters to the URL search parameters if they exist
    if (debounceFilter) {
      params.append("filter", debounceFilter);
    }

    params.append("orderBy", sortBy.orderBy);
    params.append("direction", sortBy.direction);

    try {
      // Make the API call and return the data
      const response = await axios.get("/catalog", { params });
      if (response instanceof AxiosError) {
        throw new Error("Error while fetching catalog");
      } else {
        const fetchedCatalogItems = response.data.catalog.map(
          (item: CatalogItem) =>
            new CatalogItemModel(
              item.productId,
              item.productName,
              item.productTypeId,
              item.inStock,
              item.description,
              item.price,
              item.discount,
              item.weight,
              item.kcal,
              item.mainImage,
            ),
        );
        return { ...response.data, catalog: fetchedCatalogItems };
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.error.message);
      } else throw new Error("Во время загрузки произошла неизвестная ошибка");
    }
  };

  // Infinite query hook
  const { data, error, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["catalog", debounceFilter, sortBy],
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
  }, [isVisible, isFetching]);

  // Handler for select change
  const handleSelect = async (value: string) => {
    setSelectedOption(value);
    await queryClient.invalidateQueries({ queryKey: ["orders"] });
    const option = sortOptions.find((item) => item.value === value);
    if (!option) throw new Error("Could not find seleted option");
    setSortBy({ orderBy: option.dbField, direction: option.direction });
  };

  return (
    <div className="px-4">
      <div
        className={`sticky top-0 z-30 m-auto flex max-w-screen-lg items-center justify-center bg-white`}
      >
        <div className="mb-4">
          <span
            className="mb-2 mt-4 flex justify-center gap-2 text-gray-500 transition delay-150 ease-in-out hover:cursor-pointer"
            onClick={() => setIsFiltersShown((prevVal) => !prevVal)}
          >
            <ChevronDownCircle
              className={`transition-transform duration-300 ${
                isFiltersShown ? "rotate-180" : ""
              }`}
            />
            Показать фильтр
          </span>
          <div
            className="overflow-y-hidden transition-all duration-300"
            style={{
              height: isFiltersShown
                ? filtersRef.current?.offsetHeight || 0
                : 0,
            }}
          >
            <div
              className="grid grid-cols-1 items-center gap-0 vsm:grid-cols-2 vsm:gap-4 "
              ref={filtersRef}
            >
              <div className="relative flex items-center justify-start p-2">
                <Input
                  placeholder={`Поиск по названию`}
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="max-w-[260px] pr-8"
                />
                <Search className="absolute right-4 top-[50%] h-5 w-5 translate-y-[-50%]" />
              </div>
              <div className="flex flex-col items-center justify-start gap-2 p-2 vvsm:flex-row">
                <p className="text-sm font-medium">Сортировка:</p>
                <SimpleSelect
                  options={sortOptions}
                  placeholder="Сортировать по"
                  selectedOption={selectedOption}
                  onOptionSelect={handleSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {status === "pending" ? (
        <LoadingSpinner />
      ) : status === "error" ? (
        <ErrorPage
          error={error}
          customMessage="При загрузке каталога произошла ошибка"
        />
      ) : (
        data.pages[0].totalRows > 0 && (
          <div className="m-auto grid gap-4 px-2 vsm:grid-cols-2 sm:max-w-screen-lg sm:grid-cols-3 lg:grid-cols-4">
            {data.pages.map((group, i) => (
              <Fragment key={i}>
                {group.catalog.map((item: CatalogItemModel) => (
                  <CatalogItemCard key={item.productId} catalogItem={item} />
                ))}
              </Fragment>
            ))}
          </div>
        )
      )}
      <div className="h-8 w-full" ref={ref} />
    </div>
  );
});

export default CatalogPage;
