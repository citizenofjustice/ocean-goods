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
import CatalogItemDropdown from "./UI/CatalogItemDropdown";
import TextCrossed from "./UI/TextCrossed";

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
  const { cart, auth } = useStore();
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
      <div className="w-full my-2 px-2 flex">
        <div className={`${auth.isAuth ? "w-10/12" : "w-full"}`}>
          <p className="text-center">{catalogItem.productName}</p>
        </div>
        {auth.isAuth && (
          <div className="w-2/12 text-slate-400">
            <CatalogItemDropdown>
              <Link
                to={`edit-item/${catalogItem.productId}`}
                className="py-2 p-2 flex items-center justify-between"
              >
                <p>Изменить</p>
                <PencilSquareIcon className="w-6 h-6" />
              </Link>
              <div
                className="py-2 p-2 flex items-center justify-between hover:cursor-pointer"
                onClick={() => mutation.mutate(catalogItem.productId)}
              >
                <p>Удалить</p>
                <TrashIcon className="w-6 h-6" />
              </div>
            </CatalogItemDropdown>
          </div>
        )}
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
      <div className="py-2">
        {!inCartProduct && (
          <button
            type="button"
            onClick={handleItemCartAddition}
            className={`${
              catalogItem.inStock
                ? "from-green-400 to-blue-600 hover:bg-gradient-to-bl"
                : "from-green-300 to-blue-400 cursor-default"
            } transition ease-in-out transition-all text-white bg-gradient-to-br h-8 px-2 font-medium rounded-lg text-sm text-center`}
          >
            {catalogItem.inStock ? "В корзину" : "Нет в наличии"}
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
