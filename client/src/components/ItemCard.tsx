import { observer } from "mobx-react-lite";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

import ItemInfoCard from "./UI/ItemInfoCard";
import AmountControls from "./AmontControls";
import CatalogItemModel from "../classes/CatalogItemModel";
import { useStore } from "../store/root-store-context";
import { useLocalStorage } from "@uidotdev/usehooks";
import CartItemModel from "../classes/CartItemModel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

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
  const { cart } = useStore();
  const { cartItems } = cart;
  const [, setCartContent] = useLocalStorage("cart", cartItems);

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

  // check if item is in cart (if there display amount controls)
  const inCartProduct = cart.findCartItem(catalogItem.productId);

  const handleItemCartAddition = () => {
    cart.addItem(catalogItem);
    setCartContent(cartItems);
  };

  const handleItemCartRemoval = (inCartProduct: CartItemModel) => {
    const filteredItems: CartItemModel[] = cart.amountDecrease(inCartProduct);
    setCartContent(filteredItems);
  };

  return (
    <>
      <div className="w-full my-2 flex place-content-between">
        <div className="w-10/12 text-center">{catalogItem.productName}</div>
        <div className="w-2/12 text-slate-400">
          <Link to={`edit-item/${catalogItem.productId}`}>
            <PencilSquareIcon className="w-6 h-6 hover:cursor-pointer" />
          </Link>
          <TrashIcon
            onClick={() => mutation.mutate(catalogItem.productId)}
            className="w-6 h-6 hover:cursor-pointer"
          />
        </div>
      </div>
      <div className="flex justify-center mb">
        <div className="basis-1/12" />
        <div className="grow rounded overflow-hidden flex items-center">
          {catalogItem.mainImage && <img src={catalogItem.mainImage} />}
        </div>
        <div className="basis-1/12" />
        <div className="basis-2/12 flex items-center">
          <div className="flex flex-col justify-end">
            <ItemInfoCard>{`${catalogItem.weight} гр.`}</ItemInfoCard>
            <ItemInfoCard>{`${catalogItem.kcal} ккал.`}</ItemInfoCard>
            <ItemInfoCard>{`${catalogItem.price} руб.`}</ItemInfoCard>
          </div>
        </div>
        <div className="basis-1/12" />
      </div>
      <div className="py-2">
        {!inCartProduct && (
          <button
            type="button"
            onClick={handleItemCartAddition}
            className="transition ease-in-out transition-all text-white bg-gradient-to-br h-8 px-2 from-green-400 to-blue-600 hover:bg-gradient-to-bl font-medium rounded-lg text-sm text-center"
          >
            В корзину
          </button>
        )}
        {inCartProduct && (
          <AmountControls
            currentValue={inCartProduct.amount}
            onDecrement={() => handleItemCartRemoval(inCartProduct)}
            onIncrement={handleItemCartAddition}
          />
        )}
      </div>
    </>
  );
});

export default ItemCard;
