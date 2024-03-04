import { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

import AddToCart from "./AddToCart";
import TextCrossed from "./ui/TextCrossed";
import ItemInfoCard from "./ui/ItemInfoCard";
import { useStore } from "../store/root-store-context";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import CatalogItemModel from "../classes/CatalogItemModel";
import CatalogItemDropdown from "./ui/CatalogItemDropdown";

/**
 * Renders catalog item card
 * @param catalogItem - object containinig catalog item data
 * @returns
 */
const ItemCard: React.FC<{
  catalogItem: CatalogItemModel;
}> = observer(({ catalogItem }) => {
  const queryClient = useQueryClient();
  // Calling a custom axios hook
  const axiosPrivate = useAxiosPrivate();
  // Using store context
  const { auth, alert } = useStore();

  // Defining mutation for deleting a product
  const mutation = useMutation({
    // Function to delete a product
    mutationFn: async (productId: number) => {
      const response = await axiosPrivate.delete(`/catalog/${productId}`);
      return response.data;
    },
    // Function to execute on successful deletion
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["catalog"] });
      alert.setPopup({ message: "Запись успешно удалена", type: "success" });
    },
    // Function to execute on error
    onError: (error) => {
      if (error instanceof AxiosError)
        alert.setPopup({
          message: error.response?.data.error.message,
          type: "error",
        });
    },
  });

  return (
    <>
      <div className="w-full my-2 px-2 flex">
        <div className={`${auth.isAuth ? "w-10/12" : "w-full"}`}>
          <p className="text-center font-medium px-1 vsm:px-3">
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
      <div className="flex px-3 vsm:px-4 gap-3 vsm:gap-4 justify-center">
        <div className="rounded overflow-hidden min-w-[60px] flex items-center ">
          {catalogItem.mainImage?.path && (
            <img
              className="rounded"
              src={
                import.meta.env.VITE_REACT_SERVER_URL +
                catalogItem.mainImage.path
              }
            />
          )}
        </div>
        <div className="flex items-center">
          <div className="flex flex-col justify-end">
            <ItemInfoCard>{`${catalogItem.weight} гр.`}</ItemInfoCard>
            <ItemInfoCard>{`${catalogItem.kcal} ккал.`}</ItemInfoCard>
            <ItemInfoCard>
              {catalogItem.discount > 0 ? (
                <div className="flex flex-col">
                  <TextCrossed>{`${catalogItem.price} руб.`}</TextCrossed>
                  <p>{catalogItem.finalPrice} руб.</p>
                </div>
              ) : (
                <>{`${catalogItem.price} руб.`}</>
              )}
            </ItemInfoCard>
          </div>
        </div>
      </div>
      <div className="my-2 vsm:my-3 h-8 flex items-center">
        <AddToCart
          productId={catalogItem.productId}
          catalogItem={catalogItem}
        />
      </div>
    </>
  );
});

export default ItemCard;
