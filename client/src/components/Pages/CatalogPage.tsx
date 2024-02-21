import { observer } from "mobx-react-lite";

import ItemCard from "../ItemCard";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import CatalogItemModel from "../../classes/CatalogItemModel";
import { Fragment, useEffect, useRef, useState } from "react";
import LoadingSpinner from "../UI/LoadingSpinner";
import { AxiosError } from "axios";
import axios from "../../api/axios";
import ErrorPage from "./ErrorPage";
import CatalogFilter from "../CatalogFilter";
import SimpleSelect, { SelectOptions } from "../UI/SimpleSelect";
import { useDebounce, useIntersectionObserver } from "usehooks-ts";
import { SortBy } from "../../types/SortBy";
import { CatalogItem } from "../../types/CatalogItem";

// Initial values for sorting
const initSortValues: SortBy = {
  orderBy: "productName",
  direction: "asc",
};

// Options for sorting
const sortOptions: SelectOptions[] = [
  {
    value: "productName/asc",
    content: "по названию (возр.)",
  },
  {
    value: "productName/desc",
    content: "по названию (убыв.)",
  },
  { value: "createdAt/asc", content: "по дате (возр.)" },
  {
    value: "createdAt/desc",
    content: "по дате (убыв.)",
  },
  { value: "finalPrice/asc", content: "по цене (возр.)" },
  {
    value: "finalPrice/desc",
    content: "по цене (убыв.)",
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
  const [selectedOption, setSelectedOption] = useState<string>("");
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
    const values = value.split("/");
    await queryClient.invalidateQueries({ queryKey: ["orders"] });
    setSortBy({ orderBy: values[0], direction: values[1] });
  };

  return (
    <div className="p-4">
      <div className="grid gap-0 vsm:gap-4 grid-cols-none vsm:grid-cols-2 mb-4 h-28 vsm:h-14 items-center">
        <div className="m-auto vsm:m-0 vsm:ml-auto">
          <CatalogFilter
            filterBy={filterBy}
            handleFilterInput={(e) => setFilterBy(e.target.value)}
          />
        </div>
        <div className="m-auto vsm:m-0 vsm:mr-auto">
          <SimpleSelect
            options={sortOptions}
            selectedOption={selectedOption}
            onOptionSelect={handleSelect}
          />
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
          <div className="grid gap-4 vsm:grid-cols-2 sm:grid-cols-3 sm:max-w-screen-lg m-auto">
            {data.pages.map((group, i) => (
              <Fragment key={i}>
                {group.catalog.map((item: CatalogItemModel) => (
                  <div
                    key={item.productId}
                    className="flex flex-col gap-1 items-center justify-between bg-background-100 border-background-200 border-2 rounded-lg"
                  >
                    <ItemCard key={item.productId} catalogItem={item} />
                  </div>
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
