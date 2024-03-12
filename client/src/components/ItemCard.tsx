import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import AddToCart from "./AddToCart";
import { useStore } from "../store/root-store-context";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import CatalogItemModel from "../classes/CatalogItemModel";
import { Card, CardContent, CardFooter, CardHeader } from "./UI/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./UI/dropdown-menu";
import { MoreHorizontal, SquarePen, Trash } from "lucide-react";
import ConfirmActionAlert from "./UI/ConfirmActionAlert";

/**
 * Renders catalog item card
 * @param catalogItem - object containinig catalog item data
 * @returns
 */
const ItemCard: React.FC<{
  catalogItem: CatalogItemModel;
}> = observer(({ catalogItem }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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
      <Card className="grid content-between">
        <CardHeader className="flex flex-row items-center justify-between px-4">
          <p className="w-full text-center font-medium px-1 vsm:px-3">
            <Link to={`item/${catalogItem.productId}`}>
              {catalogItem.productName}
            </Link>
          </p>
          {auth.isAuth && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreHorizontal className="w-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="translate-x-[-20%]">
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => navigate(`edit-item/${catalogItem.productId}`)}
                >
                  <SquarePen className="w-5 h-5" />
                  <p>Изменить</p>
                </DropdownMenuItem>

                <ConfirmActionAlert
                  onConfirm={() => mutation.mutate(catalogItem.productId)}
                  question="Вы уверены что хотите продолжить?"
                  message="Это действие навсегда удалит данную запись."
                >
                  <DropdownMenuItem
                    className="gap-2"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash className="w-5 h-5" />
                    <p>Удалить</p>
                  </DropdownMenuItem>
                </ConfirmActionAlert>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>
        <CardContent className="relative px-4">
          {catalogItem.mainImage?.path && (
            <Link to={`/item/${catalogItem.productId}`}>
              <img
                className="rounded"
                src={`${import.meta.env.VITE_REACT_SERVER_URL}${
                  catalogItem.mainImage.path
                }`}
              />
            </Link>
          )}
          {catalogItem.discount > 0 && (
            <div className="absolute bottom-8 right-8 flex items-center px-2 bg-destructive rounded-md font-semibold text-white">
              - {catalogItem.discount} %
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2 justify-between px-4">
          <AddToCart
            productId={catalogItem.productId}
            catalogItem={catalogItem}
          />
          <span className="font-semibold text-end">
            {catalogItem.finalPrice} руб.
          </span>
        </CardFooter>
      </Card>
    </>
  );
});

export default ItemCard;
