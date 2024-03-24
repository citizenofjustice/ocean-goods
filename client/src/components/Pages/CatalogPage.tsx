import { AxiosError } from "axios";
import { observer } from "mobx-react-lite";
import { Helmet } from "react-helmet-async";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDebounce, useIntersectionObserver } from "usehooks-ts";
import { useInfiniteQuery } from "@tanstack/react-query";

import axios from "@/api/axios";
import { SortBy } from "@/types/SortBy";
import { CatalogItem } from "@/types/CatalogItem";
import ErrorPage from "@/components/Pages/ErrorPage";
import CatalogItemModel from "@/classes/CatalogItemModel";
import CatalogItemCard from "@/components/CatalogItemCard";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import CatalogPageFilter from "../CatalogPageFilter";

// Initial values for sorting
const initSortValues: SortBy = {
  orderBy: "productName",
  direction: "asc",
};

/**
 * Component for rendering Catalog page dividided into grid
 * @returns
 */
const CatalogPage = observer(() => {
  const ref = useRef<HTMLDivElement>(null);
  const [filterBy, setFilterBy] = useState<string>("");
  const debounceFilter = useDebounce(filterBy, 750);
  const [sortBy, setSortBy] = useState(initSortValues);

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

  return (
    <>
      <Helmet>
        <title>Каталог | {import.meta.env.VITE_MAIN_TITLE}</title>
        <meta
          name="description"
          content="Каталог морских деликатесов и не только. Качественные консервы от отечественных производителей с доставкой по г. Зеленодольск."
        />
      </Helmet>
      <div className="space-y-2 px-4">
        <div
          className={`sticky top-0 z-30 m-auto flex max-w-screen-lg items-center justify-center bg-white`}
        >
          <CatalogPageFilter
            sortBy={sortBy}
            setSortBy={setSortBy}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
          />
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
            <div className="m-auto flex flex-col items-center justify-center gap-4 space-y-4 px-2 vsm:grid vsm:grid-cols-2 vsm:items-stretch vsm:space-y-0 sm:max-w-screen-lg sm:grid-cols-3 lg:grid-cols-4">
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
    </>
  );
});

export default CatalogPage;
