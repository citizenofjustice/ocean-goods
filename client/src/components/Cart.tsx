import { XMarkIcon } from "@heroicons/react/24/solid";
import { useLockBodyScroll } from "@uidotdev/usehooks";

import CartElement from "./CartItem";
import { catalogItem } from "./Pages/CatalogPage";

import Tuna from "../assets/images/Tuna.jpg";
import Saira from "../assets/images/Saira.jpeg";
import Gorbusha from "../assets/images/Gorbusha.jpg";

// extend interface of catalog item with amount
export interface cartItem extends catalogItem {
  amount: number;
}

// creating temp dummy data of cart items
const CartItems: cartItem[] = [
  {
    name: "Горбуша",
    price: 200,
    weigth: 320,
    kcal: 80,
    image: <img src={Gorbusha} />,
    amount: 4,
  },
  {
    name: "Тунец",
    price: 250,
    weigth: 280,
    kcal: 90,
    image: <img src={Tuna} />,
    amount: 8,
  },
  {
    name: "Сайра",
    price: 230,
    weigth: 350,
    kcal: 120,
    image: <img src={Saira} />,
    amount: 2,
  },
];

/**
 * Component rendering list of cart items
 * @returns
 */
const Cart: React.FC<{
  onCartClose: () => void;
}> = ({ onCartClose }) => {
  useLockBodyScroll(); // disabling body scroll

  return (
    <>
      <div>
        <div className="flex sticky top-0 bg-white border-b-2 items-center place-content-between">
          <div className="basis-1/12"></div>
          <p className="text-center">Корзина:</p>
          <div
            onClick={onCartClose}
            className="basis-1/12 flex justify-end mr-6 mt-4 mb-4 hover:cursor-pointer"
          >
            <XMarkIcon className="w-6 h-6" />
          </div>
        </div>
        <ul className="divide-y">
          {CartItems.map((item, index) => (
            <CartElement key={index} cartItem={item} />
          ))}
        </ul>
      </div>
    </>
  );
};

export default Cart;
