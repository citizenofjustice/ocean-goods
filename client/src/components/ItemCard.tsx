import { observer } from "mobx-react-lite";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

import ItemInfoCard from "./UI/ItemInfoCard";
import CatalogItemModel from "../classes/CatalogItemModel";
import { useStore } from "../store/root-store-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import CatalogItemDropdown from "./UI/CatalogItemDropdown";
import TextCrossed from "./UI/TextCrossed";
import AddToCart from "./AddToCart";

/**
 * Renders catalog item card
 * @param catalogItem - object containinig catalog item data
 * @returns
 */
const ItemCard: React.FC<{
  catalogItem: CatalogItemModel;
}> = observer(({ catalogItem }) => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useStore();

  const mutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await axiosPrivate.delete(`/catalog/${productId}`); //removeCatalogItem(productId);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["catalog"] });
      console.log("log success");
    },
    onError: () => {
      console.log("log error");
    },
    onSettled: () => {
      console.log("log settled");
    },
  });

  return (
    <>
      <div className="w-full my-2 px-2 flex">
        <div className={`${auth.isAuth ? "w-10/12" : "w-full"}`}>
          <p className="text-center font-medium px-3">
            <Link to={`item/${catalogItem.productId}`}>
              {catalogItem.productName}
            </Link>
          </p>
        </div>
        {auth.isAuth && (
          <div className="w-2/12 text-slate-400">
            <CatalogItemDropdown>
              <Link
                to={`edit-item/${catalogItem.productId}`}
                className="py-2 p-2 flex items-center justify-between"
              >
                <p>Изменить</p>
                <PencilSquareIcon className="w-6 h-6 text-primary-800" />
              </Link>
              <div
                className="py-2 p-2 flex items-center justify-between hover:cursor-pointer"
                onClick={() => mutation.mutate(catalogItem.productId)}
              >
                <p>Удалить</p>
                <TrashIcon className="w-6 h-6 text-primary-800" />
              </div>
            </CatalogItemDropdown>
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <div className="basis-1/12" />
        <div className="grow rounded overflow-hidden flex items-center p-2">
          {catalogItem.mainImage && (
            <img className="rounded" src={catalogItem.mainImage} />
          )}
        </div>
        <div className="basis-1/12" />
        <div className="basis-2/12 flex items-center">
          <div className="flex flex-col justify-end">
            <ItemInfoCard>{`${catalogItem.weight} гр.`}</ItemInfoCard>
            <ItemInfoCard>{`${catalogItem.kcal} ккал.`}</ItemInfoCard>
            <ItemInfoCard>
              {catalogItem.discount > 0 ? (
                <div className="flex flex-col">
                  <TextCrossed>{`${catalogItem.price} руб.`}</TextCrossed>
                  <p>{`${
                    catalogItem.price -
                    Math.round(catalogItem.price * (catalogItem.discount / 100))
                  } руб.`}</p>
                </div>
              ) : (
                <>{`${catalogItem.price} руб.`}</>
              )}
            </ItemInfoCard>
          </div>
        </div>
        <div className="basis-1/12" />
      </div>
      <div className="py-2 h-14 flex items-center">
        <AddToCart
          productId={catalogItem.productId}
          catalogItem={catalogItem}
        />
      </div>
    </>
  );
});

export default ItemCard;
