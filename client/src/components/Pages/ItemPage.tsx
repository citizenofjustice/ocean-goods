import { useState } from "react";
import { AxiosError } from "axios";
import { observer } from "mobx-react-lite";
import { useMediaQuery } from "usehooks-ts";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/UI/shadcn/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Separator } from "@/components/UI/shadcn/separator";
import { ScrollBar } from "@/components/UI/shadcn/scroll-area";

import axios from "@/api/axios";
import ErrorPage from "@/components/Pages/ErrorPage";
import CartAddButton from "@/components/CartAddButton";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import CatalogItemModel from "@/classes/CatalogItemModel";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

const ItemPage = observer(() => {
  const params = useParams();
  const { id } = params;
  const [catalogItem, setCatalogItem] = useState<CatalogItemModel>();
  const [catalogItemProductType, setCatalogItemProductType] = useState("");
  const nonMobile = useMediaQuery("(min-width: 1024px)");

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
        setCatalogItemProductType(data.productTypes.type);
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
          {!nonMobile ? (
            <ScrollArea className="flex justify-center">
              {catalogItem && (
                <div className="grid items-center gap-y-4 grid-cols-1 lg:grid-cols-2 sm:max-w-xl lg:max-w-5xl lg:gap-8 py-6 px-4">
                  <ItemPageMainImage catalogItem={catalogItem} />
                  <div>
                    <p className="font-bold text-xl first-letter:capitalize">
                      {catalogItem.productName}
                    </p>
                    <div className="flex items-center space-x-3">
                      <p className="font-medium opacity-70 line-through">
                        {catalogItem.price} РУБ.
                      </p>
                      <p className="font-medium">
                        {catalogItem.finalPrice} РУБ. / ШТ.
                      </p>
                    </div>
                  </div>
                  <ItemPageProductInfo
                    catalogItem={catalogItem}
                    catalogItemProductType={catalogItemProductType}
                    nonMobile={nonMobile}
                  />
                  <div className="w-full flex justify-center items-center mt-4">
                    <CartAddButton
                      productId={catalogItem.productId}
                      catalogItem={catalogItem}
                    />
                  </div>
                </div>
              )}
            </ScrollArea>
          ) : (
            <div className="flex justify-center h-[80vh]">
              {catalogItem && (
                <div className="grid grid-cols-2 items-center sm:gap-4 lg:gap-8 p-4 max-w-5xl">
                  <ItemPageMainImage catalogItem={catalogItem} />
                  <div className="">
                    <div className="flex justify-between gap-2 my-4">
                      <div className="px-4">
                        <p className="font-bold text-xl first-letter:capitalize">
                          {catalogItem.productName}
                        </p>
                        <div className="flex items-center space-x-3">
                          <p className="font-medium opacity-70 line-through">
                            {catalogItem.price} РУБ.
                          </p>
                          <p className="font-medium">
                            {catalogItem.finalPrice} РУБ. / ШТ.
                          </p>
                        </div>
                      </div>
                      <CartAddButton
                        productId={catalogItem.productId}
                        catalogItem={catalogItem}
                      />
                    </div>
                    <Card>
                      <ScrollArea className="content-scroll max-h-[60vh] p-4 overflow-y-auto">
                        <ItemPageProductInfo
                          catalogItem={catalogItem}
                          catalogItemProductType={catalogItemProductType}
                          nonMobile={nonMobile}
                        />
                        <ScrollBar orientation="vertical" />
                      </ScrollArea>
                    </Card>
                  </div>
                </div>
              )}
            </div>
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

const ItemPageMainImage: React.FC<{
  catalogItem: CatalogItemModel;
}> = ({ catalogItem }) => {
  return (
    <div className="w-fit h-fit mx-auto">
      {catalogItem.mainImage?.path && (
        <img
          className="w-full h-full rounded-lg max-w-[60vw] sm:max-w-[40vw] lg:max-w-[30vw]"
          src={`${import.meta.env.VITE_SERVER_URL}${
            catalogItem.mainImage?.path
          }`}
          alt={catalogItem.productName}
        />
      )}
    </div>
  );
};

const ItemPageProductInfo: React.FC<{
  catalogItem: CatalogItemModel;
  catalogItemProductType: string;
  nonMobile: boolean;
}> = ({ catalogItem, catalogItemProductType, nonMobile }) => {
  const [descriptionIsOpen, setDescriptionIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-1 flex flex-col">
        <span className="flex justify-between gap-2">
          <p className="font-medium">Тип продукта:</p>
          <p className="text-end">{catalogItemProductType}</p>
        </span>
        <Separator />
        <span className="flex justify-between gap-2">
          <p className="font-medium">Вес:</p>
          <p className="text-end">{catalogItem.weight} гр.</p>
        </span>
        <Separator />
        <span className="flex justify-between gap-2">
          <p className="font-medium">Ккал (100 гр.): </p>
          <p className="text-end">{catalogItem.kcal} ккал.</p>
        </span>
        <Separator />
        <span className="flex justify-between gap-2">
          <p className="font-medium">Описание:</p>
        </span>
        <span className="flex">
          <p className={`${descriptionIsOpen || nonMobile ? "" : "truncate"}`}>
            {catalogItem.description}
          </p>
          {!descriptionIsOpen && !nonMobile && (
            <p
              role="button"
              className="opacity-70 flex items-center"
              onClick={() => setDescriptionIsOpen(true)}
            >
              развернуть <ChevronDown className="w-4 h-4" />
            </p>
          )}
        </span>
        {descriptionIsOpen && !nonMobile && (
          <p
            role="button"
            className="opacity-70 flex justify-end items-center"
            onClick={() => setDescriptionIsOpen(false)}
          >
            свернуть <ChevronUp className="w-4 h-4" />
          </p>
        )}
      </div>
    </div>
  );
};

export default ItemPage;
