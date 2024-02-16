import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import LoadingSpinner from "../UI/LoadingSpinner";
import { observer } from "mobx-react-lite";
import TextCrossed from "../UI/TextCrossed";
import AddToCart from "../AddToCart";
import { useMediaQuery } from "usehooks-ts";
import CatalogItemModel from "../../classes/CatalogItemModel";
import { useState } from "react";
import ErrorPage from "./ErrorPage";
import { AxiosError } from "axios";

const ItemPage = observer(() => {
  const params = useParams();
  const { id } = params;
  const [catalogItem, setCatalogItem] = useState<CatalogItemModel>();
  const matches = useMediaQuery("(min-width: 640px)");

  const { isLoading, isError, error } = useQuery({
    queryKey: ["catalog-item"],
    queryFn: async () => {
      const response = await axios.get(`/catalog/${id}`);
      if (response instanceof AxiosError) {
        //
      } else {
        const { data } = response;
        const item = new CatalogItemModel(
          data.productId,
          data.productName,
          data.productTypeId,
          data.inStock,
          data.description,
          data.price,
          data.discount,
          data.weight,
          data.kcal,
          data.mainImage
        );
        setCatalogItem(item);
      }
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && !isError && (
        <>
          {catalogItem && (
            <>
              <div className="fixed top-[4.5rem] bottom-[4rem] sm:bottom-0 overflow-y-auto content-scroll grid gap-4 sm:gap-0 grid-cols-none sm:grid-cols-12 items-center justify-center w-full mt-0 sm:mt-4 pb-4">
                <div className="col-span-1 sm:col-start-1 sm:col-span-6 lg:col-start-2 lg:col-span-4 px-4 place-self-center">
                  <img
                    className="w-full rounded-lg max-w-[60vw] sm:max-w-[40vw] lg:max-w-[30vw]"
                    src={catalogItem.mainImage}
                    alt={catalogItem.productName}
                  />
                </div>
                <div className="sm:col-span-6 flex flex-col gap-6 px-4">
                  <div className="w-full flex items-center">
                    <p className="text-2xl sm:text-3xl font-serif font-bold first-letter:capitalize first-letter:text-primary-600">
                      {catalogItem.productName}
                    </p>
                  </div>
                  <div className="text-lg font-serif w-full flex items-start justify-around gap-2">
                    <div>
                      <p className="text-center">Цена:</p>
                      {catalogItem.discount ? (
                        <div className="flex items-center flex-col lg:flex-row lg:gap-4">
                          <p className="text-text-500">
                            <TextCrossed>{`${catalogItem.price}\u00A0руб.`}</TextCrossed>
                          </p>
                          <p>{catalogItem.finalPrice} руб.</p>
                        </div>
                      ) : (
                        <p>{catalogItem.price} руб.</p>
                      )}
                    </div>
                    <div className="flex flex-col items-center">
                      <p>Вес:</p>
                      <p>{catalogItem.weight} гр.</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <p>{`Ккал (100 гр.):`}</p>
                      <p>{catalogItem.kcal}</p>
                    </div>
                  </div>
                  <div className="w-full font-serif flex flex-col justify-center">
                    <p>Описание:</p>
                    <p className="text-gray-500">{catalogItem.description}</p>
                  </div>
                  {matches && (
                    <div className="h-16 w-full flex justify-center items-center">
                      <AddToCart
                        productId={Number(id)}
                        catalogItem={catalogItem}
                      />
                    </div>
                  )}
                </div>
              </div>
              {!matches && (
                <div className="fixed bottom-0 h-[4rem] w-full bg-background-100 drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] flex justify-center items-center">
                  <AddToCart productId={Number(id)} catalogItem={catalogItem} />
                </div>
              )}
            </>
          )}
        </>
      )}
      {isError && (
        <div className="p-4">
          <ErrorPage
            error={error}
            customMessage="При загрузке продукта произошла ошибка"
          />
        </div>
      )}
    </>
  );
});

export default ItemPage;
