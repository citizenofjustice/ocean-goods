import { useState } from "react";
import { AxiosError } from "axios";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/UI/shadcn/accordion";
import { observer } from "mobx-react-lite";
import { Helmet } from "react-helmet-async";
import { useMediaQuery } from "usehooks-ts";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/UI/shadcn/card";
import { Separator } from "@/components/UI/shadcn/separator";
import { ScrollBar } from "@/components/UI/shadcn/scroll-area";

import axios from "@/api/axios";
import ErrorPage from "@/components/Pages/ErrorPage";
import CartAddButton from "@/components/CartAddButton";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import CatalogItemModel from "@/classes/CatalogItemModel";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import imageNotFound from "@/assets/images/ImageNotFound.svg";

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
          data.mainImage,
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
      <Helmet>
        <title>
          {catalogItem?.productName
            ? `${catalogItem.productName}`
            : "Карточка продукта"}{" "}
          | {import.meta.env.VITE_MAIN_TITLE}
        </title>
        <meta
          name="description"
          content="Карточка продукта с информацией о продукте, фото и описанием."
        />
        {catalogItem && (
          <meta property="og:title" content={`${catalogItem.productName}`} />
        )}
      </Helmet>
      {isLoading && <LoadingSpinner />}
      {!isLoading && !isError && (
        <>
          {!nonMobile ? (
            <ScrollArea className="flex justify-center">
              {catalogItem && (
                <div className="grid grid-cols-1 items-center gap-y-4 px-4 py-6 sm:max-w-xl lg:max-w-5xl lg:grid-cols-2 lg:gap-8">
                  <ItemPageMainImage catalogItem={catalogItem} />
                  <div>
                    <p className="font-alegreya text-xl font-bold first-letter:capitalize">
                      {catalogItem.productName}
                    </p>
                    <div className="flex items-center space-x-3">
                      <p className="font-medium line-through opacity-70">
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
                  <div className="mt-4 flex w-full items-center justify-center">
                    <CartAddButton
                      productId={catalogItem.productId}
                      catalogItem={catalogItem}
                    />
                  </div>
                </div>
              )}
            </ScrollArea>
          ) : (
            <div className="flex h-[80vh] justify-center">
              {catalogItem && (
                <div className="grid max-w-5xl grid-cols-2 items-center p-4 sm:gap-4 lg:gap-8">
                  <ItemPageMainImage catalogItem={catalogItem} />
                  <div>
                    <div className="my-4 flex items-center justify-between gap-2">
                      <div className="px-4">
                        <p className="text-xl font-bold first-letter:capitalize">
                          {catalogItem.productName}
                        </p>
                        <div className="flex items-center space-x-3">
                          <p className="font-medium line-through opacity-70">
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
                      <ScrollArea className="content-scroll max-h-[60vh] overflow-y-auto p-4">
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
    <div className="mx-auto h-fit w-fit">
      {catalogItem.mainImage?.path ? (
        <img
          className="h-full w-full max-w-[60vw] rounded-lg sm:max-w-[40vw] lg:max-w-[30vw]"
          loading="lazy"
          width={`${catalogItem.mainImage.width}px`}
          height={`${catalogItem.mainImage.height}px`}
          src={`${import.meta.env.VITE_SERVER_URL}${
            catalogItem.mainImage?.path
          }`}
          alt={catalogItem.productName}
        />
      ) : (
        <img
          className="rounded"
          width="300px"
          height="300px"
          src={imageNotFound}
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
  const mount = nonMobile ? true : undefined;

  return (
    <div className="font-roboto space-y-4">
      <div className="flex max-w-lg flex-col space-y-1">
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
        <span className="flex justify-between gap-2">
          <Accordion type="single" className="w-full max-w-sm" collapsible>
            <AccordionItem
              className="last:border-0"
              value="product-description"
            >
              {!mount && (
                <AccordionTrigger
                  className="mb-2 flex w-full justify-between gap-4 py-0 font-normal"
                  onClick={() => setDescriptionIsOpen((prev) => !prev)}
                >
                  <p
                    className={`w-full truncate ${descriptionIsOpen ? "text-end" : "text-start"}`}
                  >
                    {descriptionIsOpen ? "Свернуть" : catalogItem.description}
                  </p>
                </AccordionTrigger>
              )}
              <AccordionContent forceMount={mount}>
                <div className="whitespace-pre-line text-base">
                  {catalogItem.description}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </span>
      </div>
    </div>
  );
};

export default ItemPage;
