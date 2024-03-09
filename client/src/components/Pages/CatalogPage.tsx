import { observer } from "mobx-react-lite";
import ItemCard from "../ItemCard";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import CatalogItemModel from "../../classes/CatalogItemModel";
import { Fragment, useEffect, useRef, useState } from "react";
import LoadingSpinner from "../UI/LoadingSpinner";
import { AxiosError } from "axios";
import axios from "../../api/axios";
import ErrorPage from "./ErrorPage";
import SimpleSelect, { SelectOptions } from "../UI/SimpleSelect";
import { useDebounce, useIntersectionObserver } from "usehooks-ts";
import { SortBy } from "../../types/SortBy";
import { CatalogItem } from "../../types/CatalogItem";
import { Input } from "../UI/input";
import { ChevronDownCircle, ChevronUpCircle, Search } from "lucide-react";

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
              item.mainImage
            )
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
        className={`m-auto z-30 max-w-screen-lg sticky top-0 bg-white flex gap-4 justify-center items-center`}
      >
        {!isFiltersShown && (
          <span
            className="my-4 flex justify-center gap-2 hover:cursor-pointer text-gray-500"
            onClick={() => setIsFiltersShown(true)}
          >
            <ChevronDownCircle /> Показать фильтр
          </span>
        )}
        {isFiltersShown && (
          <>
            <span
              className="flex justify-center gap-2 hover:cursor-pointer text-gray-500"
              onClick={() => setIsFiltersShown(false)}
            >
              <ChevronUpCircle />
            </span>
            <div className="my-2 h-28 vsm:h-20 grid gap-0 vsm:gap-4 grid-cols-none vsm:grid-cols-2 items-center">
              <div className="m-auto vsm:m-0 vsm:ml-auto relative">
                <Input
                  placeholder={`Поиск по названию`}
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="max-w-[260px] pr-8"
                />
                <Search className="absolute top-[50%] translate-y-[-50%] right-2 w-5 h-5" />
              </div>
              <div className="m-auto vsm:m-0 vsm:mr-auto">
                <SimpleSelect
                  options={sortOptions}
                  placeholder="Сортировать по"
                  selectedOption={selectedOption}
                  onOptionSelect={handleSelect}
                />
              </div>
            </div>
          </>
        )}
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
          <div className="grid gap-4 vsm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 sm:max-w-screen-lg px-2 m-auto">
            {data.pages.map((group, i) => (
              <Fragment key={i}>
                {group.catalog.map((item: CatalogItemModel) => (
                  <ItemCard key={item.productId} catalogItem={item} />
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
