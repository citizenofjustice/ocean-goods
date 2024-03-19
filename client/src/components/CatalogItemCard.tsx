import { AxiosError } from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/UI/shadcn/card";
import { observer } from "mobx-react-lite";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/UI/shadcn/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import imageNotFound from "@/assets/images/ImageNotFound.svg";
import { useStore } from "@/store/root-store-context";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import CartAddButton from "@/components/CartAddButton";
import CatalogItemModel from "@/classes/CatalogItemModel";
import ConfirmActionAlert from "@/components/UI/ConfirmActionAlert";

/**
 * Renders catalog item card
 * @param catalogItem - object containinig catalog item data
 * @returns
 */
const CatalogItemCard: React.FC<{
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
          <p className="w-full px-1 text-center font-medium vsm:px-3">
            <Link to={`item/${catalogItem.productId}`}>
              {catalogItem.productName}
            </Link>
          </p>
          {auth.isAuth && (
            <DropdownMenu>
              <DropdownMenuTrigger aria-label="Выпадаюшее меню продукта">
                <MoreHorizontal className="w-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="translate-x-[-20%]">
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => navigate(`edit-item/${catalogItem.productId}`)}
                  aria-label="Редактировать продукт"
                >
                  <SquarePen className="h-5 w-5" />
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
                    aria-label="Удалить продукт"
                  >
                    <Trash2 className="h-5 w-5" />
                    <p>Удалить</p>
                  </DropdownMenuItem>
                </ConfirmActionAlert>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>
        <CardContent className="relative px-4">
          <Link to={`/item/${catalogItem.productId}`}>
            {catalogItem.mainImage?.path ? (
              <img
                className="rounded"
                width={`${catalogItem.mainImage.width}px`}
                height={`${catalogItem.mainImage.height}px`}
                src={`${import.meta.env.VITE_SERVER_URL}${
                  catalogItem.mainImage.path
                }`}
                alt="Фото продукта"
              />
            ) : (
              <img
                className="rounded"
                width="300px"
                height="300px"
                src={imageNotFound}
                alt="Изображение не найдено"
              />
            )}
          </Link>
          {catalogItem.discount > 0 && (
            <div className="absolute bottom-8 right-8 flex items-center rounded-md bg-red-700 px-2 font-semibold text-white">
              - {catalogItem.discount} %
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between gap-2 px-4">
          <CartAddButton
            productId={catalogItem.productId}
            catalogItem={catalogItem}
          />
          <span className="text-end font-semibold">
            {catalogItem.finalPrice} руб.
          </span>
        </CardFooter>
      </Card>
    </>
  );
});

export default CatalogItemCard;
